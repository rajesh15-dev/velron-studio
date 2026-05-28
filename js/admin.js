/* =========================
ADMIN PASSWORD
========================= */

const ADMIN_PASSWORD =
"velronadmin";



if(
  !localStorage.getItem("velron_admin_login")
){

  const password =
  prompt("Enter Admin Password");



  if(password !== ADMIN_PASSWORD){

    alert("Wrong Password");

    window.location.href =
    "/";

  }

  else{

    localStorage.setItem(
      "velron_admin_login",
      "true"
    );

  }

}





/* =========================
ELEMENTS
========================= */

const publishBtn =
document.getElementById("publishBtn");

const generatedLink =
document.getElementById("generatedLink");

const addProductBtn =
document.getElementById("addProductBtn");

const productsWrapper =
document.getElementById("productsWrapper");

const uploadPopup =
document.getElementById("uploadPopup");

const uploadStatusText =
document.getElementById("uploadStatusText");

const publishedReelsContainer =
document.getElementById("publishedReelsContainer");

const copyBtn =
document.getElementById("copyBtn");



/* =========================
EDIT SYSTEM
========================= */

let currentEditReelId = null;

let currentEditProductId = null;



const editPopup =
document.getElementById("editPopup");

const closeEditPopup =
document.getElementById("closeEditPopup");

const updateReelBtn =
document.getElementById("updateReelBtn");



if(closeEditPopup){

  closeEditPopup.addEventListener("click", () => {

    editPopup.style.display =
    "none";

  });

}





/* =========================
MENU
========================= */

const menuBtn =
document.querySelector(".menu-btn");

const menuDrawer =
document.querySelector(".menu-drawer");

const menuOverlay =
document.querySelector(".menu-overlay");

const closeMenu =
document.querySelector(".close-menu");



if(menuBtn){

  menuBtn.addEventListener("click", () => {

    menuDrawer.classList.add("active");

    menuOverlay.classList.add("active");

  });

}



if(closeMenu){

  closeMenu.addEventListener("click", () => {

    menuDrawer.classList.remove("active");

    menuOverlay.classList.remove("active");

  });

}



if(menuOverlay){

  menuOverlay.addEventListener("click", () => {

    menuDrawer.classList.remove("active");

    menuOverlay.classList.remove("active");

  });

}





/* =========================
PRODUCT COUNTER
========================= */

let productCount = 1;





/* =========================
ADD PRODUCT
========================= */

if(addProductBtn){

  addProductBtn.addEventListener("click", () => {

    productCount++;

    const productHTML = `

      <div class="product-upload-card">

        <button
          class="remove-product-btn"
        >
          ✕
        </button>



        <h3 class="product-upload-title">
          Product ${productCount}
        </h3>



        <div class="input-group">

          <label>
            Product Title
          </label>

          <input
            type="text"
            class="product-title"
            placeholder="Enter Product Title"
          >

        </div>



        <div class="input-group">

          <label>
            Product URL
          </label>

          <input
            type="text"
            class="product-link"
            placeholder="Paste Product URL"
          >

        </div>



        <div class="input-group">

          <label>
            Upload Product Image
          </label>

          <input
            type="file"
            class="product-image"
            accept="image/*"
          >

        </div>

      </div>

    `;

    productsWrapper.insertAdjacentHTML(
      "beforeend",
      productHTML
    );



    /* REMOVE PRODUCT */

    const removeButtons =
    document.querySelectorAll(
      ".remove-product-btn"
    );



    removeButtons.forEach(btn => {

      btn.addEventListener("click", () => {

        btn.parentElement.remove();

      });

    });

  });

}





/* =========================
POPUP
========================= */

function showPopup(text){

  uploadPopup.style.display =
  "flex";

  uploadStatusText.innerText =
  text;

}



function hidePopup(){

  uploadPopup.style.display =
  "none";

}





/* =========================
UPLOAD IMAGE
========================= */

async function uploadImage(file){

  const fileName =
  `${Date.now()}-${file.name}`;



  const { error } =

  await supabaseClient.storage

  .from("uploads")

  .upload(fileName, file);



  if(error){

    console.log(error);

    return null;

  }



  const { data } =

  supabaseClient.storage

  .from("uploads")

  .getPublicUrl(fileName);



  return data.publicUrl;

}





/* =========================
PUBLISH REEL
========================= */

if(publishBtn){

  publishBtn.addEventListener("click", async () => {

    publishBtn.disabled =
    true;



    publishBtn.innerText =
    "Publishing...";



    const reelUrl =
    document.getElementById("adminReelUrl").value.trim();



    const reelCoverFile =
    document.getElementById("reelCoverFile").files[0];



    if(
      reelUrl === "" ||
      !reelCoverFile
    ){

      alert("Fill all required fields");



      publishBtn.disabled =
      false;



      publishBtn.innerText =
      "Publish Reel";



      return;

    }



    showPopup("Uploading Reel Cover...");



    /* REEL IMAGE */

    const reelImageUrl =
    await uploadImage(reelCoverFile);



    if(!reelImageUrl){

      hidePopup();

      alert("Reel cover upload failed");



      publishBtn.disabled =
      false;



      publishBtn.innerText =
      "Publish Reel";



      return;

    }



    /* SLUG */

    const slug =
    Math.random()
    .toString(36)
    .substring(2,8);




    /* SAVE REEL */

    showPopup("Saving Reel Data...");



    const { data: reelData, error: reelError } =

    await supabaseClient

    .from("reels")

    .insert([
      {
        slug:slug,

        instagram_url:reelUrl,

        reel_image:reelImageUrl
      }
    ])

    .select();



    if(reelError){

      console.log(reelError);

      hidePopup();

      alert("Error publishing reel");



      publishBtn.disabled =
      false;



      publishBtn.innerText =
      "Publish Reel";



      return;

    }



    /* PRODUCTS */

    const productTitles =
    document.querySelectorAll(".product-title");



    const productLinks =
    document.querySelectorAll(".product-link");



    const productImages =
    document.querySelectorAll(".product-image");



    for(let i = 0; i < productLinks.length; i++){

      const title =
      productTitles[i].value.trim();



      const link =
      productLinks[i].value.trim();



      const imageFile =
      productImages[i].files[0];



      if(
        link === "" ||
        !imageFile
      ){

        continue;

      }



      showPopup(`Uploading Product ${i + 1}...`);



      const productImageUrl =
      await uploadImage(imageFile);



      if(!productImageUrl){

        continue;

      }



      await supabaseClient

      .from("products")

      .insert([
        {
          reel_id:String(reelData[0].id),

          title:
          title || `VELRON Product ${i + 1}`,

          image:productImageUrl,

          affiliate_url:link
        }
      ]);

    }



    /* FINAL URL */

    const finalUrl =
    `${window.location.origin}/reel.html?id=${slug}`;



    generatedLink.innerText =
    finalUrl;



    generatedLink.href =
    finalUrl;



    publishBtn.innerText =
    "Published ✓";



    showPopup("Published Successfully 🚀");



    setTimeout(() => {

      hidePopup();

    },1800);



    fetchPublishedReels();



    /* RESET FORM */

    document.getElementById(
      "adminReelUrl"
    ).value = "";



    document.getElementById(
      "reelCoverFile"
    ).value = "";



    publishBtn.disabled =
    false;

  });

}





/* =========================
FETCH REELS
========================= */

async function fetchPublishedReels(){

  const { data, error } =

  await supabaseClient

  .from("reels")

  .select("*")

  .order("created_at", {
    ascending:false
  });



  if(error){

    console.log(error);

    return;

  }



  publishedReelsContainer.innerHTML =
  "";



  for(const reel of data){

    const card = `

      <div class="published-card">

        <img
          src="${reel.reel_image}"
          class="published-image"
          loading="lazy"
        >



        <div class="published-actions">

          <button
            class="edit-btn"
            onclick="openEditPopup('${reel.id}')"
          >
            Edit
          </button>



          <button
            class="delete-btn"
            onclick="deleteReel('${reel.id}')"
          >
            Delete
          </button>

        </div>

      </div>

    `;



    publishedReelsContainer.insertAdjacentHTML(

      "beforeend",

      card

    );

  }

}





/* =========================
DELETE REEL
========================= */

async function deleteReel(reelId){

  const confirmDelete =
  confirm("Delete this reel?");



  if(!confirmDelete){

    return;

  }



  showPopup("Deleting Reel...");



  await supabaseClient

  .from("products")

  .delete()

  .eq("reel_id", reelId);



  await supabaseClient

  .from("reels")

  .delete()

  .eq("id", reelId);



  hidePopup();



  fetchPublishedReels();

}





/* =========================
OPEN EDIT
========================= */

async function openEditPopup(reelId){

  currentEditReelId =
  reelId;



  const { data: reelData } =

  await supabaseClient

  .from("reels")

  .select("*")

  .eq("id", reelId)

  .single();



  const { data: productData } =

  await supabaseClient

  .from("products")

  .select("*")

  .eq("reel_id", reelId)

  .single();



  if(!productData){

    return;

  }



  currentEditProductId =
  productData.id;



  document.getElementById("editReelUrl").value =
  reelData.instagram_url;



  document.getElementById("editProductLink").value =
  productData.affiliate_url;



  editPopup.style.display =
  "flex";

}





/* =========================
UPDATE REEL
========================= */

if(updateReelBtn){

  updateReelBtn.addEventListener("click", async () => {

    const newReelUrl =
    document.getElementById("editReelUrl").value.trim();



    const newProductLink =
    document.getElementById("editProductLink").value.trim();



    showPopup("Updating Reel...");



    await supabaseClient

    .from("reels")

    .update({
      instagram_url:newReelUrl
    })

    .eq("id", currentEditReelId);



    await supabaseClient

    .from("products")

    .update({
      affiliate_url:newProductLink
    })

    .eq("id", currentEditProductId);



    editPopup.style.display =
    "none";



    hidePopup();



    fetchPublishedReels();

  });

}





/* =========================
COPY BUTTON
========================= */

if(copyBtn){

  copyBtn.addEventListener("click", async () => {

    const text =
    generatedLink.href;



    await navigator.clipboard.writeText(text);



    copyBtn.innerText =
    "Copied ✓";



    setTimeout(() => {

      copyBtn.innerText =
      "Copy";

    },2000);

  });

}





/* =========================
INIT
========================= */

fetchPublishedReels();
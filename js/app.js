/* MENU */

const menuBtn =
document.querySelector(".menu-btn");

const menuDrawer =
document.querySelector(".menu-drawer");

const menuOverlay =
document.querySelector(".menu-overlay");

const closeMenu =
document.querySelector(".close-menu");



if(menuBtn && menuDrawer){

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





/* HOME FEED */

async function loadHomeFeed(){

  const feedContainer =
  document.getElementById("feedContainer");



  if(!feedContainer){

    return;

  }



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



  feedContainer.innerHTML = "";



  data.forEach(reel => {

    const card = `

      <a
        href="./reel.html?id=${reel.slug}"
        class="feed-card"
      >

        <img
          src="${reel.reel_image}"
          class="feed-image"
        >



        <div class="feed-overlay">

          <span>
            VIEW LOOK
          </span>

        </div>

      </a>

    `;



    feedContainer.insertAdjacentHTML(

      "beforeend",

      card

    );

  });

}





/* REEL SEARCH */

const previewBtn =
document.getElementById("previewBtn");



if(previewBtn){

  previewBtn.addEventListener("click", async () => {

    const reelInput =
    document.getElementById("reelInput").value.trim();



    if(reelInput === ""){

      return;

    }



    const { data, error } =

    await supabaseClient

    .from("reels")

    .select("*")

    .eq("instagram_url", reelInput)

    .single();



    if(error || !data){

      alert("Reel not found");

      return;

    }



    window.location.href =
    `./reel.html?id=${data.slug}`;

  });

}





/* DYNAMIC REEL PAGE */

async function loadReelPage(){

  const params =
  new URLSearchParams(window.location.search);

  const reelSlug =
  params.get("id");



  if(!reelSlug){

    return;

  }



  /* FETCH REEL */

  const { data: reelData, error: reelError } =

  await supabaseClient

  .from("reels")

  .select("*")

  .eq("slug", reelSlug)

  .single();



  if(reelError){

    console.log(reelError);

    return;

  }



  /* FETCH PRODUCTS */

  const { data: productsData, error: productsError } =

  await supabaseClient

  .from("products")

  .select("*")

  .eq("reel_id", reelData.id);



  if(productsError){

    console.log(productsError);

    return;

  }



  /* REEL IMAGE */

  const reelPreview =
  document.getElementById("reelPreview");



  if(reelPreview){

    reelPreview.src =
    reelData.reel_image;

  }



  /* PLAY BUTTON */

  const playBtn =
  document.querySelector(".play-btn");



  if(playBtn){

    playBtn.addEventListener("click", () => {

      window.location.href =
      reelData.instagram_url;

    });

  }



  /* PRODUCTS */

  const productsContainer =
  document.getElementById("productsContainer");



  if(productsContainer){

    productsContainer.innerHTML = "";



    productsData.forEach(product => {

      const card = `

        <div class="product-card">

          <div class="product-image">

            <img
              src="${product.image}"
              alt=""
            >

          </div>



          <div class="product-info">

            <h4>
              ${product.title}
            </h4>



            <div class="product-save">
              SAVE PRODUCT
            </div>



            <a
              href="${product.affiliate_url}"
              target="_blank"
            >
              GET PRODUCT
            </a>

          </div>

        </div>

      `;



      productsContainer.insertAdjacentHTML(

        "beforeend",

        card

      );

    });

  }

}





/* INIT */

loadHomeFeed();

loadReelPage();
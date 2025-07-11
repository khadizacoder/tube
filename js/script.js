function removeActiveClass(){
    const activeButton = document.getElementsByClassName('active');
    for (let btn of activeButton) {
        btn.classList.remove('active')
    }
}

function loadCategories() {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
};

const loadVideos = (searchInput = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchInput}`)
    .then((res) => res.json())
    .then((data) => {
        document.getElementById('btn_all').classList.add('active');
        displayVideos(data.videos)
    })
};

const loadCategoryVideos = (id) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        removeActiveClass()
        const clickedBtn = document.getElementById(`btn_${id}`);
        clickedBtn.classList.add('active');
        displayVideos(data.category);
    })
};

const loadVideoDetails = (videoId) => {
    // console.log(videoId)
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    fetch(url)
    .then((res) => res.json())
    .then((data) => displayVideoDetails(data.video))
};

const displayVideoDetails = (video) => {
    console.log(video)
    document.getElementById('display_modal').showModal();
    const detailsContainer = document.getElementById('details_container');

    detailsContainer.innerHTML=`
      <div class="card bg-base-100 image-full shadow-sm mx-auto">
        <figure>
            <img class="w-full h-[170px mx-auto]"
            src="${video.thumbnail}"
            alt="Movie" />
        </figure>
        <div class="card-body">
            <div class="flex justify-left gap-2 pt-5">
                <img class="w-10 h-10 rounded-full ring-primary ring-offset-base-100 ring ring-offset-2" src="${video.authors[0].profile_picture}" alt="">
                <div>
                    <div class="flex gap-2 items-center justify-left pt-2">
                        <span class="text-[#ffffff] text-sm">${video.authors[0].profile_name}</span>
                        <span>
                            ${video.authors[0].verified === true? `<img src="./images/Group.png" alt="">` : ``} 
                        </span>
                    </div>
                    <div><h3 class="text-sm block">${video.others.views} </h3></div>
                </div>
            </div>
            <h2 class="card-title">Title: ${video.title}</h2>
        </div>
    </div>
    <p class="mt-4">${video.description}</p>
    <div class="modal-action">
        <form method="dialog">
            <button class="btn">Close</button>
        </form>
    </div>
    `
}

const displayCategories = (categorie) => {
    const categoryContainer = document.getElementById('category_container');
    for (const cat of categorie) {
        const createDiv = document.createElement('div');
        // console.log(cat.category_id)
        createDiv.innerHTML = `
        <button id="btn_${cat.category_id}" onclick="loadCategoryVideos(${cat.category_id})" class="btn btn-sm text-[#252525] bg-[#25252520] hover:bg-[#FF1F3D] hover:text-white text-base px-3 sm:px-5">${cat.category}</button>
        `
        categoryContainer.append(createDiv);
    }
};

const displayVideos = (videos) => {
    const boxContainer = document.getElementById('box_container');
    boxContainer.innerHTML = "";
    if(videos.length === 0){
        boxContainer.innerHTML = `
            <div class="flex flex-col col-span-full items-center justify-center text-center p-4 py-20">
                <img class="w-[120px]" src="images/Icon.png" alt="">
                <h2 class="font-bold text-2xl mt-2 mx-auto">Oops!! Sorry, There is no content here</h2>
            </div>
        `
        return;
    }
    
    videos.forEach((video) => {
        const createDiv = document.createElement('div');
        createDiv.classList.add('shadow-xl');
        // console.log(video)
        createDiv.innerHTML = `
        <figure class="relative">
            <img class="w-full sm:h-auto md:h-[170px] rounded object-cover" src="${video.thumbnail}" alt="">
            <span class="absolute bottom-3 right-3 text-white bg-[#00000070] py-2 px-4 rounded text-sm">3hrs ago</span>
        </figure>
        <div class="flex justify-left gap-2 py-5 px-3">
            <img class="w-10 h-10 rounded-full ring-primary ring-offset-base-100 ring ring-offset-2" src="${video.authors[0].profile_picture}" alt="">
            <div>
                <h2 class="font-semibold text-base color-[#171717]">${video.title}</h2>
                <div class="flex gap-2 items-center justify-left pt-2">
                    <span class="text-[#17171770] text-sm">${video.authors[0].profile_name}</span>
                    <span>
                    ${video.authors[0].verified == true ? `
                        <img src="./images/Group.png" alt="">
                        ` : ``}
                    </span>
                </div>
                <p class="text-[#17171770] text-sm">${video.others.views} </p>
            </div>
        </div>
        <button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-block border-none">Show Details</button>
        `
        boxContainer.appendChild(createDiv);
    });
};

document.getElementById('search_input').addEventListener('keyup',(event) => {
    const input = event.target.value;
    loadVideos(input)
})

loadCategories();
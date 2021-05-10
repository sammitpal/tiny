const url = document.getElementById("url");
const slug = document.getElementById("slug");
const tinyurl = document.querySelector(".tinyurl");
const btn = document.getElementById("btn");

console.log(window.location.href);

btn.addEventListener("click", async (e) => {
  tinyurl.innerHTML = "";
  e.preventDefault();
  const data = {
    url: url.value,
    slug: slug.value,
  };
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const resp = await fetch("/create", options);
  const respData = await resp.json();
  console.log(respData);

  if (respData.message === "Slug in use") {
    return;
  } else {

    const card = document.createElement('div');
    card.classList.add('card');

    const p = document.createElement("p");
    p.innerHTML = window.location.href + respData.slug;
    p.id = 'purl'

    const button = document.createElement('button');
    button.innerHTML = "COPY";
    button.classList.add('copy')

    button.addEventListener('click',()=>{
      const textarea = document.createElement("textarea");
      textarea.value = p.innerHTML;
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0,99999);
      document.execCommand("copy");
      textarea.remove();

      alert('copied to clipboard text: ')
    })

    card.appendChild(p)
    card.appendChild(button)

    tinyurl.appendChild(card);
  }
});

// Get rating for each product
function getRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 === 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  let html = '';
  for (let i = 0; i < fullStars; i++) {
    html += `<i class="fa-solid fa-star" aria-hidden="true"></i>`;
    // html += `<span>🌕</span>`
  }
  if (halfStars) {
    html += `<i class="fa-regular fa-star-half-stroke" aria-hidden="true"></i>`;
    // html += `<span>🌗</span>`
  }
  for (let i = 0; i < emptyStars; i++) {
    html += `<i class="fa-regular fa-star" aria-hidden="true"></i>`;
    // html += `<span>🌑</span>`;
  }
  return html;
}

export default getRatingStars;

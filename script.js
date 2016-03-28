'use strict';

{
  const img = document.getElementById('img');
  const colorList = document.getElementById('colors');
  const draw = document.getElementById('draw');
  const fileInput = document.getElementById('file');

  const dumpColors = (colors) => {
    colorList.innerHTML = '';
    colors.forEach((color) => {
      const li = document.createElement('li');

      li.style.backgroundColor = color;
      colorList.appendChild(li);
    });
    draw.style.backgroundColor = colors[0];
  };

  const getColors = () => {
    const dominant = new window.DominantColor(img, dumpColors);
  };

  const setImage = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    img.src = window.URL.createObjectURL(file);
    getColors();
  };

  fileInput.addEventListener('change', setImage);
  getColors();
}

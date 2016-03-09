"use strict";

{
  const img = document.getElementById('input');
  const colorsList = document.getElementById('colors');
  const draw = document.getElementById('draw');

  RGBaster.colors(img, {
    paletteSize: 20,
    success: function(colors) {
      console.log(colors.dominant);
      console.log(colors.secondary);
      console.log(colors.palette);

      colors.palette.forEach((color) => {
        const li = document.createElement('li');
        li.style.backgroundColor = color;
        colorsList.appendChild(li);
      });

      draw.style.backgroundColor = colors.palette[0]
    }
  });
}

'use strict';

{
  // algorythm: https://gist.github.com/loretoparisi/c147ca437ab9d5e163b7
  class DominantColor {
    constructor(imgElem, callback) {
      const img = new Image();
      const canvas = document.createElement('canvas');

      // document.appendChild(canvas);
      this.ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        const colors = this.processImage(img, this.ctx);

        callback(colors);
        console.log(colors);

        this.colors = colors;
        // document.removeChild(canvas);
      };
      img.src = imgElem.src;
    }

    processImage(img, ctx) {
      const points = [];

      ctx.drawImage(img, 0, 0, img.width, img.height);

      const data = ctx.getImageData(0, 0, img.width, img.height).data;

      // TODO: forEach + skip
      for (let i = 0, l = data.length; i < l; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 1 + 1];

        points.push([r, g, b]);
      }

      const k = 3;
      const results = this.kmeans(points, k, 1);

      return results.map((value) => this.rgbToHex(value[0]));
    }

    kmeans(points, k, minDiff) {
      const pointsLength = points.length;
      const clusters = [];
      const seen = [];

      // 何やってるのかわかんない
      while (clusters.length < k) {
        let found = false;
        const index = parseInt(Math.random() * pointsLength, 10);

        for (let i = 0; i < seen.length; i++) {
          if (index === seen[i]) {
            found = true;
            break;
          }
        }

        if (!found) {
          seen.push(index);
          clusters.push([points[index], [points[index]]]);
        }
      }

      while (true) {
        const plists = new Array(k).fill([]);

        points.forEach((p) => {
          let smallestDistance = 10000000;
          let index = 0;

          for (let i = 0; i < k; i++) {
            const distance = this.euclidean(p, clusters[i][0]);

            if (distance < smallestDistance) {
              smallestDistance = distance;
              index = i;
            }
          }

          plists[index].push(p);
        });

        let diff = 0;

        for (let i = 0; i < k; i++) {
          const old = clusters[i];
          const center = this.calculateCenter(plists[i], 3);
          const newCluster = [center, (plists[i])];
          const dist = this.euclidean(old[0], center);

          clusters[i] = newCluster;
          diff = diff > dist ? diff : dist;
        }

        if (diff < minDiff) {
          break;
        }
      }

      return clusters;
    }

    euclidean(p1, p2) {
      let s = 0;

      for (let i = 0, l = p1.length; i < l; i++) {
        s += Math.pow(p1[i] - p2[i], 2);
      }

      return Math.sqrt(s);
    }

    calculateCenter(points, n) {
      const vals = [];
      let plen = 0;

      for (let i = 0; i < n; i++) { vals.push(0); }

      for (let i = 0, l = points.length; i < l; i++) {
        plen++;

        for (let j = 0; j < n; j++) {
          vals[j] += points[i][j];
        }
      }

      for (let i = 0; i < n; i++) {
        vals[i] /= plen;
      }

      return vals;
    }

    rgbToHex(rgb) {
      const th = (i) => {
        const h = parseInt(i).toString(16);

        return h.length === 1 ? `0${h}` : h;
      };

      return `#${th(rgb[0])}${th(rgb[1])}${th(rgb[2])}`;
    }

    getColors() {
      return this.colors;
    }
  }

  window.DominantColor = DominantColor;
}

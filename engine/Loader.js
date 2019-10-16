;
(function () {
    'use strict'

    class Loader {
        constructor() {
            this.loadOrder = {
                images: [],
                jsons: [],
            }
            this.resources = {
                images: [],
                jsons: [],
            }
        };

        addImage(name, src) {
            //console.log('name: ', name);
            this.loadOrder.images.push({
                name,
                src
            });
        }

        addJson(id, address) {
            this.loadOrder.jsons.push({
                id,
                address
            });
        }


        load(clb) {
            const promises = [];

            for (const imageData of this.loadOrder.images) {
                //console.log('imageData: ', imageData); 
                const { name, src } = imageData;

                const promise = Loader
                    .loadImage(src)
                    .then(image => {
                        this.resources.images[name] = image;

                        if (this.loadOrder.images.includes(imageData)) {
                            const index = this.loadOrder.images.indexOf(imageData);
                            this.loadOrder.images.splice(index, 1);
                        }
                    })
                promises.push(promise);
            };

            for (const jsonData of this.loadOrder.jsons) {
                console.log('jsonData: ', jsonData); 
                const { id, address } = jsonData;

                const promise = Loader
                    .loadJson(address)
                    .then(json => {
                        this.resources.jsons[id] = json;

                        if (this.loadOrder.jsons.includes(jsonData)) {
                            const index = this.loadOrder.jsons.indexOf(jsonData);
                            this.loadOrder.jsons.splice(index, 1);
                        }
                    })
                promises.push(promise);
            }

            Promise.all(promises).then(clb)
        }

        static loadImage(src) {
            return new Promise((resolve, reject) => {
                try {
                    const image = new Image;
                    image.onload = () => resolve(image);
                    image.src = src;
                    //document.body.appendChild(image);

                } catch (err) {
                    reject(err);
                }
            })
        }

        static loadJson (address) {
            return new Promise((resolve, reject) => {
                fetch(address)
                .then(result => result.json())
                .then(result => resolve(result))
                .catch(err => reject(err));
            })
        }
    }

    window.GameEngine = window.GameEngine || {};
    window.GameEngine.Loader = Loader;


})();
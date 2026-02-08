export default class Header {
    constructor() {
        this.element = document.querySelector('.page-header');

        if (this.element) {
            this.onInit();
        }
    }

    onInit() {
        console.log('header init');
    }
}

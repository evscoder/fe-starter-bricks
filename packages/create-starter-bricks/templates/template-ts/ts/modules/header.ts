export default class Header {
    element: Element | null;

    constructor() {
        this.element = document.querySelector('.page-header');

        if (this.element) {
            this.onInit();
        }
    }

    onInit(): void {
    }
}

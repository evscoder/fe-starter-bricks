export interface IFactory {
    onInit?: () => void;
    destroy?: () => void;
    dispose?: () => void;
}

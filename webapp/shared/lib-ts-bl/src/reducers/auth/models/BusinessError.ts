
export default class BusinessError extends Error {
    constructor(msg: string, suggestedAction?: { text: string, action: () => void; }) {
        super(msg);

        if (suggestedAction) {
            this.suggestedAction = suggestedAction;
        }

        Object.setPrototypeOf(this, BusinessError.prototype);
    }

    public getMessage() {
        return this.message;
    }

    public suggestedAction?: { text: string, action: () => void; } = undefined;

    public setSuggestedAction(suggestedAction?: { text: string, action: () => void; }) {
        this.suggestedAction = suggestedAction;
    }

    public getSuggestedActionText() {
        return this.suggestedAction?.text ?? "";
    }

    public getSuggestedActionFn() {
        return this.suggestedAction?.action ?? (() => { });
    }
}

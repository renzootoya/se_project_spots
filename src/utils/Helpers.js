export function setButtonText(
    btn,
    isloading,
    defaultText = "save",
    loadingText = "saving..."
    ) {
        if (isloading) {
            btn.textContent = loadingText;
        } else {
            btn.textContent = defaultText;
        }
    }

    export  function setButtonTextDelete(
        btn,
        isloading,
        defaultText = "delete",
        loadingText = "deleting..."
        ) {
            if (isloading) {
                btn.textContent = loadingText;
            } else {
                btn.textContent = defaultText;
            }
        } 
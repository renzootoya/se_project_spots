export function setButtonText(
    btn,
    isloading,
    defaultText = "save",
    loadingText = "saving..."
    ) {
        if (isloading) {
            btn.textContent = loadingText;
            btn.disabled = true;
        } else {
            btn.textContent = defaultText;
            btn.disabled = false;
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
                btn.disabled = true;    
            } else {
                btn.textContent = defaultText;
                btn.disabled = false;
            }
        } 
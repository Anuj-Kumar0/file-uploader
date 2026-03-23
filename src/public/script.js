const fileInput = document.getElementById("fileInput");
            const fileName = document.getElementById("fileName");

            fileInput.addEventListener("change", () => {
                fileName.textContent = fileInput.files.length > 0
                    ? fileInput.files[0].name
                    : "No file selected";
            });
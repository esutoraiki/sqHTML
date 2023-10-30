(function () {
    "use strict";

    const
        s1 = document.getElementById("version"),
        json_package = "../package.json",

        NSHome = (function () {
            return {
                get_version_sqhtml: () => {
                    fetch(json_package)
                        .then(result => result.json())
                        .then(data => {
                            s1.innerText = data.version;
                        });
                }
            };
        }())
    ;

    window.addEventListener("load", function () {
        NSHome.get_version_sqhtml();
    });
}());

document.addEventListener("alpine:init", () => {
    Alpine.data("app", () => ({
        init() {
            if ("google" in window) this.doMapStuff();
        },
        async doMapStuff() {
            // The marker, positioned at Uluru
            const marker = new google.maps.Marker({
                position: uluru,
                map: map
            });
        }
    }));
});

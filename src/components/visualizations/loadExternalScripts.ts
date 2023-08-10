const isRelative = (path: string) => path.startsWith("./");
const normalizeRelativePath = (path: string) =>
    [process.env.PUBLIC_URL, path.replace(/^\.\//, "")].join("/");

const isScriptLoaded = (src: string) =>
    document.querySelector('script[src="' + src + '"]') ? true : false;

export const loadExternalScript = (src: string) => {
    if (isRelative(src)) {
        src = normalizeRelativePath(src);
    }

    return new Promise((resolve, reject) => {
        if (isScriptLoaded(src)) {
            return resolve();
        }

        const element = document.createElement("script");

        element.src = src;
        element.type = "text/javascript";
        element.async = false;

        const cleanup = () => {
            console.log(`Dynamic Script Removed: ${src}`);
            document.head.removeChild(element);
        };

        element.onload = () => {
            console.log(`Dynamic Script Loaded: ${src}`);
            try {
                resolve();
            } catch (e) {
                cleanup();
                reject();
            }
        };

        element.onerror = () => {
            console.error(`Dynamic Script Error: ${src}`);
            cleanup();
            reject();
        };

        document.head.appendChild(element);
    });
};

export const getVisualizationContainerDomId = (id: string) => `item-${id}`;

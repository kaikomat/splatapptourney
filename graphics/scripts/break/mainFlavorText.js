const mainFlavorTl = gsap.timeline();

mainFlavorText.on('change', newValue => {
    mainFlavorTl.add(textOpacitySwap(newValue, document.getElementById('main-flavor-text')));
});

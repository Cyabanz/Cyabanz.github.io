class NavigationEffect {
  constructor(navigation) {
    this.previous = null;
    this.current = null;
    this.navigation = navigation;
    this.anchors = this.navigation.querySelectorAll("a");

    this.anchors.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        this.handlePrevious();
        this.handleCurrent(anchor);
      });
    });
  }

  handleCurrent(current) {
    this.current = current;
    this.current.classList.toggle("active");
    const nodes = this.getNodes(this.current);

    gsap.to(nodes[0], {
      duration: 0.8,
      ease: RoughEase.ease.config({ strength: 3, points: 20 }),
      attr: { y: "0%" },
      overwrite: true,
      stagger: 0.012
    });

    gsap.to(nodes[1], {
      duration: 0.8,
      ease: RoughEase.ease.config({ strength: 3, points: 20 }),
      attr: { y: "0%" },
      stagger: 0.012,
      overwrite: true,
      delay: 0.11
    });

    gsap.fromTo(
      nodes[1],
      {
        opacity: 1
      },
      {
        opacity: 0.75,
        duration: 0.13,
        ease: RoughEase.ease.config({ strength: 5, points: 50 }),
        repeat: -1,
        delay: 1.1
      }
    );
  }

  handlePrevious() {
    this.previous = document.querySelector(".active");
    if (this.previous) {
      this.previous.classList.toggle("active");
      const nodes = this.getNodes(this.previous);
      gsap.to(nodes[0], {
        duration: 0.2,
        ease: "power1.out",
        attr: { y: "100%" },
        overwrite: true,
        stagger: 0.012
      });

      gsap.to(nodes[1], {
        duration: 0.2,
        ease: "power1.out",
        attr: { y: "100%" },
        overwrite: true,
        delay: 0.02,
        stagger: 0.012
      });
    }
  }

  getNodes(item) {
    return [
      gsap.utils.shuffle(gsap.utils.selector(item)(".blue rect")),
      gsap.utils.shuffle(gsap.utils.selector(item)(".pink rect"))
    ];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(EasePack);
  new NavigationEffect(document.querySelector("nav"));
});

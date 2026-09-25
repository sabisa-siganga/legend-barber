import beardShapeUpImage from "../assets/images/service-beard-shape-up.png";
import cutAndBeardImage from "../assets/images/service-cut-beard-detail.png";
import kidsCutImage from "../assets/images/service-kids-cut.png";
import lineUpImage from "../assets/images/service-line-up-edge-detail.png";
import signatureCutImage from "../assets/images/service-signature-cut.png";
import skinFadeImage from "../assets/images/service-skin-fade.png";
import type { Service } from "../types/service";

export const formatServicePrice = (price: number): string => `R${price}`;

export const isBookableService = (
  service: Service | null,
): service is Service => {
  if (service === null) {
    return false;
  }

  return (
    service.id.trim() !== "" &&
    service.name.trim() !== "" &&
    service.description.trim() !== "" &&
    service.image.trim() !== "" &&
    service.alt.trim() !== "" &&
    Number.isFinite(service.price)
  );
};

export const services: readonly Service[] = [
  {
    id: "signature-cut",
    name: "Signature Cut",
    price: 220,
    description:
      "A tailored cut with a clean finish, shaped to suit your look.",
    image: signatureCutImage,
    alt: "Barber cutting hair with scissors for a signature cut",
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    price: 250,
    description:
      "Sharp blending, precise tapering and a finish that stays clean.",
    image: skinFadeImage,
    alt: "Barber blending a skin fade with clippers",
  },
  {
    id: "cut-beard-detail",
    name: "Cut + Beard Detail",
    price: 320,
    description: "A complete reset with a tailored cut and refined beard work.",
    image: cutAndBeardImage,
    alt: "Barber detailing a beard along the jawline",
  },
  {
    id: "beard-shape-up",
    name: "Beard Shape-Up",
    price: 150,
    description: "Clean lines, balanced shape and detail where it matters.",
    image: beardShapeUpImage,
    alt: "Barber shaping the cheek line of a beard",
  },
  {
    id: "kids-cut",
    name: "Kids Cut",
    price: 160,
    description:
      "A neat, comfortable cut with a sharp finish for younger clients.",
    image: kidsCutImage,
    alt: "Barber clipping a child's hair in the chair",
  },
  {
    id: "line-up-edge-detail",
    name: "Line-Up & Edge Detail",
    price: 120,
    description: "Crisp hairline work to bring definition back to your look.",
    image: lineUpImage,
    alt: "Barber defining a hairline with a trimmer",
  },
];

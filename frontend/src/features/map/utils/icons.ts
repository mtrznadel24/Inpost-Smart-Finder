import * as L from "leaflet";

const svgPin = `<svg width="28" height="40" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
  <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z" fill="#FBBF24" stroke="#18181B" stroke-width="16"/>
  <circle cx="192" cy="192" r="50" fill="#18181B"/>
</svg>`;

export const pinIcon = L.divIcon({
  className: "bg-transparent border-none drop-shadow-md",
  html: svgPin,
  iconSize: [28, 40],
  iconAnchor: [14, 40],
});

export const createCustomClusterIcon = (cluster: any) => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-10 h-10 bg-yellow-400 text-zinc-900 font-bold rounded-full border-4 border-white shadow-lg">
            ${cluster.getChildCount()}
          </div>`,
    className: "bg-transparent border-none",
    iconSize: L.point(40, 40, true),
  });
};
// oxlint-disable eslint/no-magic-numbers

const DATA_COLORS = {
  Base_cut: "#D7DC96",
  Base: "#6F9FA0",
  Clay: "#C9A94E",
  Eastern_sand: "#7FAF7A",
  Eastern_trapp: "#477D68",
  Main_fault_plane: "#B97777",
  Reservoir_limit_plane: "#B97777",
  Top_clay: "#C9A94E",
  Top_eastern_sand: "#7FAF7A",
  Top_eastern_trapp: "#477D68",
  Top_folded_limestone: "#B985AE",
  Top_western_sand: "#7FAF7A",
  Top_western_trapp: "#477D68",
  Topo: "#A8A0C8",
  Topo_from_photogram: "#A8A0C8",
  Vertical_contact_plane: "#B97777",
  Western_sand: "#7FAF7A",
  Western_trapp: "#477D68",
};

const HEX_BASE = 16;
const HEX_CHUNK_LEN = 2;
const RED_OFFSET = 0;
const GREEN_OFFSET = 2;
const BLUE_OFFSET = 4;

function hexToRgba(hex) {
  const sanitized = hex.replace("#", "");
  return {
    red: Number.parseInt(sanitized.slice(RED_OFFSET, RED_OFFSET + HEX_CHUNK_LEN), HEX_BASE),
    green: Number.parseInt(sanitized.slice(GREEN_OFFSET, GREEN_OFFSET + HEX_CHUNK_LEN), HEX_BASE),
    blue: Number.parseInt(sanitized.slice(BLUE_OFFSET, BLUE_OFFSET + HEX_CHUNK_LEN), HEX_BASE),
    alpha: 1,
  };
}

const INITIAL_CAMERA = {
  focal_point: [-10.3, 21.4, 362.58],
  position: [-104.92, -45.84, 377.24],
  view_up: [0, 0, 1],
};

function applyInitialCamera(hybridViewerStore) {
  const { genericRenderWindow } = hybridViewerStore;
  if (!genericRenderWindow?.value) {
    return;
  }
  const renderer = genericRenderWindow.value.getRenderer();
  const camera = renderer.getActiveCamera();
  camera.setFocalPoint(...INITIAL_CAMERA.focal_point);
  camera.setPosition(...INITIAL_CAMERA.position);
  camera.setViewUp(...INITIAL_CAMERA.view_up);
  renderer.resetCameraClippingRange();
  const renderWindow = genericRenderWindow.value.getRenderWindow();
  renderWindow.render();
  hybridViewerStore.syncRemoteCamera();
}

let hasImportedData = false;

function setHasImportedData(value = true) {
  hasImportedData = value;
}

function getHasImportedData() {
  return hasImportedData;
}

export {
  DATA_COLORS,
  INITIAL_CAMERA,
  applyInitialCamera,
  getHasImportedData,
  hexToRgba,
  setHasImportedData,
};

const { __ } = wp.i18n;

const ICON_SHAPE = [
  { label: __("Rounded"), value: "rounded" },
  { label: __("Circular"), value: "circular" },
  { label: __("Square"), value: "square" }
];

const ICON_ALIGN = [
  { label: __("Start"), value: "flex-start" },
  { label: __("End"), value: "flex-end" },
  { label: __("Space between"), value: "space-between" },
  { label: __("Space around"), value: "space-around" }
];

const BORDER_TYPES = [
  { label: __("Dashed"), value: "dashed" },
  { label: __("Solid"), value: "solid" },
  { label: __("Dotted"), value: "dotted" },
  { label: __("Double"), value: "double" },
  { label: __("Groove"), value: "groove" },
  { label: __("Inset"), value: "inset" },
  { label: __("Outset"), value: "outset" },
  { label: __("Ridge"), value: "ridge" }
];

const HOVER_ANIMATION = [
  { label: __("None"), value: "" },
  { label: __("Grow"), value: "grow" },
  { label: __("Shrink"), value: "shrin" },
  { label: __("Pulse"), value: "pulse" },
  { label: __("Pulse Grow"), value: "pulse-grow" },
  { label: __("Pulse Shrink"), value: "pulse-shrink" },
  { label: __("Push"), value: "push" },
  { label: __("Pop"), value: "pop" },
  { label: __("Bounce In"), value: "bounce-in" },
  { label: __("Bounce Out"), value: "bounce-out" },
  { label: __("Rotate"), value: "rotate" },
  { label: __("Float"), value: "float" },
  { label: __("Sink"), value: "sink" },
  { label: __("Bob"), value: "bob" },
  { label: __("Hang"), value: "hang" },
  { label: __("Skew"), value: "skew" },
  { label: __("Skew Forward"), value: "skew-forward" },
  { label: __("Skew Backword"), value: "skew-backward" },
  { label: __("Wobble Horizontal"), value: "wobble-horizontal" },
  { label: __("Wobble Vertical"), value: "wobble-vertical" },
  { label: __("Wobble To Bottom Right"), value: "wobble-to-top-right" },
  { label: __("Wobble To Top Right"), value: "wobble-to-bottom-right" },
  { label: __("Wobble Top"), value: "wobble-top" },
  { label: __("Wobble Bottom"), value: "wobble-bottom" },
  { label: __("Wobble Skew"), value: "wobble-skew" },
  { label: __("Buzz"), value: "buzz" },
  { label: __("Buzz Out"), value: "buzz-out" },
  { label: __("Forward"), value: "forward" },
  { label: __("Backward"), value: "backward" },
  { label: __("Shadow"), value: "shadow" },
  { label: __("Grow Shadow"), value: "grow-shadow" },
  { label: __("Float Shadow"), value: "float-shadow" },
  { label: __("Glow"), value: "glow" },
  { label: __("Shadow Radial"), value: "shadow-radial" },
  { label: __("Box Shadow Outset"), value: "box-shadow-outset" },
  { label: __("Box Shadow Inset"), value: "box-shadow-inset" }
];

export { ICON_SHAPE, ICON_ALIGN, BORDER_TYPES, HOVER_ANIMATION };

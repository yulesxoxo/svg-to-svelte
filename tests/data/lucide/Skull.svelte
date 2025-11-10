<script lang="ts">
  let {
    width = "24",
    height = "24",
    fill = "none",
    stroke = "currentColor",
    "stroke-linecap": strokeLinecap = "round",
    "stroke-linejoin": strokeLinejoin = "round",
    "stroke-width": strokeWidth = "2",
    ...rest
  } = $props();
</script>

<svg
  {width}
  {height}
  {fill}
  {stroke}
  stroke-linecap={strokeLinecap}
  stroke-linejoin={strokeLinejoin}
  stroke-width={strokeWidth}
  viewBox="0 0 24 24"
  {...rest}
>
  <path d="m12.5 17-.5-1-.5 1h1z" />
  <path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z" />
  <circle cx="15" cy="12" r="1" />
  <circle cx="9" cy="12" r="1" />
</svg>

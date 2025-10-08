<script lang="ts">
    let {
        width = "24",
        height = "24",
        viewBox = "0 0 24 24",
        stroke = "currentColor",
        "stroke-width": strokeWidth = "2",
        "stroke-linecap": strokeLinecap = "round",
        "stroke-linejoin": strokeLinejoin = "round",
        ...rest
    } = $props();
</script>

<svg
        {width}
        {height}
        {viewBox}
        {stroke}
        stroke-width={strokeWidth}
        stroke-linecap={strokeLinecap}
        stroke-linejoin={strokeLinejoin}
        {...rest}
>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
</svg>
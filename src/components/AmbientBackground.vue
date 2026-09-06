<template>
  <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]"></div>

    <div
      class="absolute inset-0 opacity-[0.015] mix-blend-overlay"
      style="background-image: url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>&quot;);"
    ></div>

    <div
      class="ambient-blob absolute left-1/2 top-[-220px] h-[1400px] w-[900px] -translate-x-1/2 rounded-full bg-[#5E6AD2]/25 blur-[150px]"
    ></div>
    <div
      class="ambient-blob-slow absolute left-[-180px] top-[180px] h-[800px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),rgba(236,72,153,0.08),transparent_70%)] blur-[120px]"
    ></div>
    <div
      class="ambient-blob absolute right-[-120px] top-[280px] h-[700px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(94,106,210,0.2),rgba(59,130,246,0.1),transparent_70%)] blur-[100px]"
    ></div>
    <div
      class="ambient-blob-pulse absolute bottom-[-80px] left-1/3 h-[420px] w-[520px] rounded-full bg-[#5E6AD2]/10 blur-[110px]"
    ></div>

    <div
      class="absolute inset-0 opacity-[0.02]"
      style="background-image: linear-gradient(rgb(255 255 255 / 40%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 40%) 1px, transparent 1px); background-size: 64px 64px;"
    ></div>
  </div>
</template>

# GLB Animator

Web app untuk upload file `.glb`, preview model 3D + animasinya langsung di browser, lalu generate kode React Three Fiber yang siap di-copy-paste ke project lain.

100% client-side — tidak ada file yang diupload ke server manapun.

## Fitur

- Upload `.glb` lewat drag-and-drop atau file picker (maks 100MB)
- Preview 3D dengan orbit/zoom/pan
- Deteksi otomatis animation clips yang ada di dalam file
- Play/pause, pilih clip, atur speed (0.5x–2x), dan loop mode
- Generate kode React Three Fiber (TypeScript + Suspense) lengkap dengan syntax highlighting dan tombol copy

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Tech stack

React + Vite + TypeScript, [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei), Tailwind CSS, Prism.js.

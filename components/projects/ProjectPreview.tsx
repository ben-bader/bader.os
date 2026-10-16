import Image from 'next/image'
import { Image as ImageIcon } from 'lucide-react'

type ProjectPreviewProps = {
  title: string
  image?: { src: string; alt: string }
}

export default function ProjectPreview({ title, image }: ProjectPreviewProps) {
  return (
    <figure className="project-preview relative m-0 grid aspect-[16/10] w-full place-items-center overflow-hidden border border-border-strong bg-background-soft" aria-label={`${title} project preview`}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 700px) 100vw, 45vw"
          className="object-cover"
        />
      ) : (
        <figcaption className="project-preview-placeholder flex h-full w-full flex-col items-center justify-center gap-[10px] text-muted">
          <ImageIcon className="opacity-75" aria-hidden="true" size={20} strokeWidth={1.5} />
          <span className="text-[.68rem] tracking-[.08em] uppercase">Project preview</span>
        </figcaption>
      )}
    </figure>
  )
}

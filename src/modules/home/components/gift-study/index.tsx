"use client"

import Image from "next/image"
import { CSSProperties, useId, useState } from "react"
import styles from "./study.module.css"

const tones = [
  { name: "Walnut", value: "#604A3A", shade: "#453328", inverse: true },
  { name: "Warm Ivory", value: "#F2EDE3", shade: "#D8C8B0", inverse: false },
  { name: "Deep Botanical", value: "#35453B", shade: "#26342C", inverse: true },
] as const

/** CSS perspective renders a real six-face object without a canvas, render loop,
 * model downloads or a graphics dependency. Motion only follows explicit input.
 */
export default function GiftStudy() {
  const descriptionId = useId()
  const [open, setOpen] = useState(false)
  const [tone, setTone] = useState(0)
  const [angle, setAngle] = useState(-28)
  const selected = tones[tone]
  const vars = { "--box-tone": selected.value, "--box-shade": selected.shade, "--box-angle": `${angle}deg` } as CSSProperties

  return (
    <figure className={styles.study} style={vars} aria-label="Interactive AREVÉ packaging study">
      <div className={styles.arch} aria-hidden="true" />
      <div className={styles.caption}><span className="eyebrow">The Modern Heirloom</span><span>01 — A study in giving</span></div>
      <div className={styles.stage} aria-hidden="true" data-testid="gift-study" data-open={open}>
        <div className={styles.shadow} />
        <div className={styles.box}>
          <div className={`${styles.face} ${styles.front}`} />
          <div className={`${styles.face} ${styles.back}`} />
          <div className={`${styles.face} ${styles.left}`} />
          <div className={`${styles.face} ${styles.right}`} />
          <div className={`${styles.face} ${styles.bottom}`} />
          <div className={styles.interior}>
            <div className={styles.tissue} />
            <div className={styles.note}>
              <Image src="/brand/icon-charcoal.svg" alt="" width={28} height={30} loading="eager" />
              <span>For someone<br />worth remembering.</span>
              <span className={styles.noteRule} />
              <span className={styles.signature}>Culture, Refined.</span>
            </div>
          </div>
          <div className={styles.lid} data-open={open}>
            <div className={styles.lidTop}>
              <Image src={`/brand/wordmark-${selected.inverse ? "warm-ivory" : "charcoal"}.svg`} alt="" width={150} height={42} loading="eager" />
            </div>
            <div className={`${styles.face} ${styles.lidFront}`} />
            <div className={`${styles.face} ${styles.lidBack}`} />
            <div className={`${styles.face} ${styles.lidLeft}`} />
            <div className={`${styles.face} ${styles.lidRight}`} />
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <fieldset>
          <legend className="sr-only">Explore the brand palette</legend>
          <div className="flex gap-1">
            {tones.map((item, index) => <button key={item.name} type="button" aria-label={`View ${item.name} packaging study`}
              aria-pressed={tone === index} onClick={() => setTone(index)} className={styles.swatch}>
              <span style={{ backgroundColor: item.value }} />
            </button>)}
          </div>
        </fieldset>
        <div className="flex items-center gap-1">
          <button type="button" className={styles.rotate} onClick={() => setAngle(value => Math.max(-58, value - 15))} disabled={angle <= -58} aria-label="Rotate packaging left">↶</button>
          <button type="button" className={styles.open} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls={descriptionId}>{open ? "Close the box" : "Lift the lid"}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
          <button type="button" className={styles.rotate} onClick={() => setAngle(value => Math.min(32, value + 15))} disabled={angle >= 32} aria-label="Rotate packaging right">↷</button>
        </div>
      </div>
      <figcaption id={descriptionId} className={styles.description}>
        <span aria-live="polite">{selected.name}. {open ? "A personal note, revealed." : "A considered object, beautifully given."}</span>
        <span>Packaging concept</span>
      </figcaption>
    </figure>
  )
}

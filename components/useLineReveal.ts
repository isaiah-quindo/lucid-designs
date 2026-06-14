'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Options = {
  start?: string
  duration?: number
  stagger?: number
  delay?: number
}

export function useLineReveal<T extends HTMLElement>({
  start = 'top 80%',
  duration = 1.1,
  stagger = 0.09,
  delay = 0,
}: Options = {}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = ref.current
    if (!el) return

    const original = el.innerHTML
    let tween: gsap.core.Tween | null = null
    let raf = 0

    const split = () => {
      el.innerHTML = original

      const wrapNode = (node: Node, italic: boolean) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || ''
          if (!text) return
          const frag = document.createDocumentFragment()
          text.split(/(\s+)/).forEach((part) => {
            if (!part) return
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part))
            } else {
              const span = document.createElement('span')
              span.className = '__word'
              span.style.display = 'inline-block'
              if (italic) span.style.fontStyle = 'italic'
              span.textContent = part
              frag.appendChild(span)
            }
          })
          node.parentNode?.replaceChild(frag, node)
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const child = node as HTMLElement
          const isItalic =
            italic ||
            child.tagName === 'EM' ||
            child.tagName === 'I' ||
            child.classList.contains('italic')
          Array.from(child.childNodes).forEach((c) => wrapNode(c, isItalic))
        }
      }
      Array.from(el.childNodes).forEach((n) => wrapNode(n, false))

      // Unwrap any non-word formatting elements so words sit as direct children
      const wrappers = Array.from(el.querySelectorAll('*')).filter(
        (e) => !e.classList.contains('__word'),
      )
      wrappers.forEach((w) => {
        const parent = w.parentNode
        if (!parent) return
        while (w.firstChild) parent.insertBefore(w.firstChild, w)
        parent.removeChild(w)
      })

      // Group words by offsetTop into lines
      type Line = { top: number; nodes: Node[] }
      const lines: Line[] = []
      let current: Line | null = null
      const tolerance = 4

      Array.from(el.childNodes).forEach((node) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as HTMLElement).classList.contains('__word')
        ) {
          const top = (node as HTMLElement).offsetTop
          if (!current || Math.abs(top - current.top) > tolerance) {
            current = { top, nodes: [node] }
            lines.push(current)
          } else {
            current.nodes.push(node)
          }
        } else if (current) {
          current.nodes.push(node)
        }
      })

      lines.forEach((line) => {
        const mask = document.createElement('span')
        mask.className = '__mask'
        mask.style.display = 'block'
        mask.style.overflow = 'hidden'
        mask.style.paddingBottom = '0.08em'
        const inner = document.createElement('span')
        inner.className = '__line'
        inner.style.display = 'block'
        inner.style.willChange = 'transform'
        const first = line.nodes[0]
        first.parentNode?.insertBefore(mask, first)
        mask.appendChild(inner)
        line.nodes.forEach((n) => inner.appendChild(n))
      })

      tween?.scrollTrigger?.kill()
      tween?.kill()
      const inners = el.querySelectorAll<HTMLElement>('.__line')
      if (!inners.length) return
      gsap.set(inners, { yPercent: 110 })
      tween = gsap.to(inners, {
        yPercent: 0,
        duration,
        ease: 'power4.out',
        stagger,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      })
    }

    split()

    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(split)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      tween?.scrollTrigger?.kill()
      tween?.kill()
      el.innerHTML = original
    }
  }, [start, duration, stagger, delay])

  return ref
}

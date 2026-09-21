import { useEffect } from 'react';

const SITE_NAME = 'MoUmroh';
const DEFAULT_TITLE = 'MoUmroh — Marketplace Paket Umroh dari Travel Terpercaya';
const DEFAULT_DESCRIPTION =
  'Bandingkan paket umroh dari berbagai travel terverifikasi. Lihat harga, jadwal keberangkatan, dan durasi perjalanan dalam satu tempat.';

/**
 * Sets the page title and meta description while a page is mounted.
 * Pass nothing (or undefined) while data is still loading and the
 * site-wide defaults are used instead.
 */
export default function useSeo(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description || DEFAULT_DESCRIPTION);
  }, [title, description]);
}
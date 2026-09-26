import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleX,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  MoveRight,
  Phone,
  Sparkles,
  Star,
  X,
} from 'lucide-react';

import './index.css';

// One obvious place to replace the provisional owner contact before launch.
const CONTACT = {
  phoneDisplay: '0176 89 02 17 11',
  phoneHref: 'tel:+4917689021711',
  whatsappHref: 'https://wa.me/4917689021711',
  mapsHref:
    'https://www.google.com/maps/dir/?api=1&destination=Weberzipfel+19%2C+83512+Wasserburg+am+Inn',
};

const imageUrl = (filename: string) =>
  `${import.meta.env.BASE_URL}images/${filename}`;

const images = {
  hero: imageUrl('hero-nails.jpg'),
  lashes: imageUrl('lashes-detail.jpg'),
  nailDesign: imageUrl('nail-design.jpg'),
  manicure: imageUrl('manicure.jpg'),
  beautyProfile: imageUrl('beauty-profile.jpg'),
};

const gallery = [
  { src: images.nailDesign, alt: 'Demoaufnahme: Nude-Nägel mit feinem Design', label: 'Nageldesign · Demo', className: 'gallery-tall' },
  { src: images.lashes, alt: 'Demoaufnahme: Wimpernverlängerung im Nahporträt', label: 'Wimpern · Demo', className: 'gallery-wide' },
  { src: images.manicure, alt: 'Demoaufnahme: glossy Maniküre in zartem Blush', label: 'Maniküre · Demo', className: 'gallery-square' },
  { src: images.beautyProfile, alt: 'Demoaufnahme: Wimpernstyling im Seitenprofil', label: 'Wimpern · Demo', className: 'gallery-wide gallery-offset' },
];

const nailServices = ['Gel Nägel', 'Acryl Nägel', 'Nagelverlängerung', 'Maniküre', 'Nail Design'];
const lashServices = ['Wimpernverlängerung', 'Natürliches Styling', 'Volumen Looks', 'Auffüllen'];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [stickyCtaReady, setStickyCtaReady] = useState(false);
  const [stickyCtaHidden, setStickyCtaHidden] = useState(true);
  const [form, setForm] = useState({
    treatment: 'Noch offen',
    date: '',
    name: '',
    message: 'Hallo INN STYLE,\n\nich würde gerne einen Termin anfragen.\n\nBehandlung: Noch offen\nWunschtermin:\nName:',
  });

  useEffect(() => {
    document.body.style.overflow = appointmentOpen || lightboxIndex !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [appointmentOpen, lightboxIndex]);

  useEffect(() => {
    const stickyCta = document.querySelector<HTMLButtonElement>('.mobile-sticky-cta');
    const contactSection = document.querySelector<HTMLElement>('.contact-section');
    if (!stickyCta || !contactSection) {
      setStickyCtaReady(true);
      setStickyCtaHidden(false);
      return;
    }

    const protectedContent = Array.from(
      document.querySelectorAll(
        'main h1, main h2, main h3, main p, main a, main button, main img, .trust-strip, .service-card li, .gallery-item, .review-rating, .contact-section, .map-section, .site-footer',
      ),
    );
    const obstructingContent = new Set<Element>();
    let contactHasReachedViewport =
      contactSection.getBoundingClientRect().top <= window.innerHeight;
    let contentObserver: IntersectionObserver | null = null;
    let initialEntriesRemaining = protectedContent.length;
    let lastHiddenState: boolean | null = null;

    const syncCtaVisibility = () => {
      const hidden = contactHasReachedViewport || obstructingContent.size > 0;
      if (hidden === lastHiddenState) return;
      lastHiddenState = hidden;
      setStickyCtaHidden(hidden);
    };

    const updateContactVisibility = () => {
      contactHasReachedViewport =
        contactSection.getBoundingClientRect().top <= window.innerHeight;
      syncCtaVisibility();
    };
    const contactObserver = new IntersectionObserver(updateContactVisibility);
    contactObserver.observe(contactSection);

    const observeCtaOverlap = () => {
      updateContactVisibility();
      contentObserver?.disconnect();
      const ctaBounds = stickyCta.getBoundingClientRect();
      if (window.innerWidth > 800 || ctaBounds.width === 0) {
        setStickyCtaReady(true);
        syncCtaVisibility();
        return;
      }

      initialEntriesRemaining = protectedContent.length;
      if (initialEntriesRemaining === 0) {
        setStickyCtaReady(true);
        syncCtaVisibility();
        return;
      }

      const clearance = 6;
      const topMargin = Math.max(0, ctaBounds.top - clearance);
      const rightMargin = Math.max(0, window.innerWidth - ctaBounds.right - clearance);
      const bottomMargin = Math.max(0, window.innerHeight - ctaBounds.bottom - clearance);
      const leftMargin = Math.max(0, ctaBounds.left - clearance);
      contentObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) obstructingContent.add(entry.target);
          else obstructingContent.delete(entry.target);
        }
        initialEntriesRemaining -= entries.length;
        if (initialEntriesRemaining <= 0) setStickyCtaReady(true);
        syncCtaVisibility();
      }, {
        rootMargin: `-${topMargin}px -${rightMargin}px -${bottomMargin}px -${leftMargin}px`,
      });
      protectedContent.forEach((element) => contentObserver?.observe(element));
    };

    observeCtaOverlap();
    window.addEventListener('resize', observeCtaOverlap, { passive: true });
    window.addEventListener('scroll', updateContactVisibility, { passive: true });
    window.visualViewport?.addEventListener('resize', observeCtaOverlap, { passive: true });

    return () => {
      contactObserver.disconnect();
      contentObserver?.disconnect();
      window.removeEventListener('resize', observeCtaOverlap);
      window.removeEventListener('scroll', updateContactVisibility);
      window.visualViewport?.removeEventListener('resize', observeCtaOverlap);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAppointmentOpen(false);
        setLightboxIndex(null);
      }
      if (lightboxIndex !== null && event.key === 'ArrowRight') {
        setLightboxIndex((lightboxIndex + 1) % gallery.length);
      }
      if (lightboxIndex !== null && event.key === 'ArrowLeft') {
        setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex]);

  const openAppointment = () => {
    setMenuOpen(false);
    setSent(false);
    setAppointmentOpen(true);
  };

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const syncMessage = (treatment: string, date: string, name: string) => {
    updateForm(
      'message',
      `Hallo INN STYLE,\n\nich würde gerne einen Termin anfragen.\n\nBehandlung: ${treatment}\nWunschtermin: ${date || ''}\nName: ${name || ''}`,
    );
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <button className="brand-mark" onClick={() => scrollToId('start')} data-testid="button-brand">
            <span className="brand-word">INN STYLE</span>
            <span className="brand-sub">Nagel &amp; Wimpernstudio</span>
          </button>
          <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Hauptnavigation">
            {[
              ['Start', 'start'],
              ['Leistungen', 'leistungen'],
              ['Galerie', 'galerie'],
              ['Bewertungen', 'bewertungen'],
              ['Kontakt', 'kontakt'],
            ].map(([label, id]) => (
              <button key={id} onClick={() => { setMenuOpen(false); scrollToId(id); }} data-testid={`link-nav-${id}`}>
                {label}
              </button>
            ))}
            <button className="nav-cta" onClick={openAppointment} data-testid="button-nav-appointment">
              Termin anfragen <ArrowUpRight size={15} strokeWidth={1.8} />
            </button>
          </nav>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={menuOpen}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section" id="start">
          <div className="hero-image-wrap">
            <img src={images.hero} alt="Editorial Aufnahme einer eleganten Nude-Maniküre" className="hero-image" width="1200" height="1500" />
            <div className="hero-image-caption"><span>01</span><span>Beauty, die bleibt.</span></div>
          </div>
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> Wasserburg am Inn</p>
            <h1>Schöne Nägel.<br /><em>Perfekte Wimpern.</em><br />Dein Style.</h1>
            <p className="hero-lede">Professionelle Nagel- &amp; Wimpernbehandlungen in Wasserburg am Inn.</p>
            <div className="hero-actions">
              <button className="button button-dark" onClick={openAppointment} data-testid="button-hero-appointment">Termin anfragen <ArrowUpRight size={16} /></button>
              <button className="text-link" onClick={() => scrollToId('leistungen')} data-testid="link-hero-services">Leistungen ansehen <MoveRight size={17} /></button>
            </div>
            <div className="hero-signature"><span className="signature-rule" /><span>INN STYLE</span><span className="signature-rule" /></div>
          </div>
          <div className="hero-scroll"><ArrowDown size={15} /><span>Entdecken</span></div>
        </section>

        <section className="trust-strip" aria-label="Studio Informationen">
          <div className="trust-item"><span className="trust-value">4,7 <Star size={14} fill="currentColor" /></span><span>Google Bewertung</span></div>
          <div className="trust-divider" />
          <div className="trust-item"><MapPin size={15} strokeWidth={1.4} /><span>Wasserburg am Inn</span></div>
          <div className="trust-divider" />
          <div className="trust-item"><Sparkles size={15} strokeWidth={1.4} /><span>Nagel &amp; Wimpernstudio</span></div>
        </section>

        <section className="section services-section" id="leistungen">
          <div className="section-intro">
            <p className="eyebrow"><span className="eyebrow-line" /> Leistungen</p>
            <h2>Dein Moment.<br /><em>Dein Style.</em></h2>
            <p className="section-copy">Schönheit beginnt dort, wo Handwerk auf deinen persönlichen Stil trifft.</p>
          </div>
          <div className="service-grid">
            <article className="service-card service-nails">
              <div className="service-card-top"><span className="service-number">01</span><span className="service-label">Hands</span></div>
              <h3>NÄGEL</h3>
              <p>Von clean &amp; natürlich bis ausdrucksstarkes Design — gepflegte Hände, die zu dir passen.</p>
              <ul>{nailServices.map((service) => <li key={service}><Check size={13} />{service}<span>Preis auf Anfrage</span></li>)}</ul>
              <button className="card-link" onClick={openAppointment} data-testid="button-services-nails">Termin anfragen <ArrowUpRight size={16} /></button>
              <div className="service-watermark">N</div>
            </article>
            <article className="service-card service-lashes">
              <div className="service-card-top"><span className="service-number">02</span><span className="service-label">Eyes</span></div>
              <h3>WIMPERN</h3>
              <p>Ein Blick, der deine Augen unterstreicht — individuell, präzise und ganz du.</p>
              <ul>{lashServices.map((service) => <li key={service}><Check size={13} />{service}<span>Preis auf Anfrage</span></li>)}</ul>
              <button className="card-link" onClick={openAppointment} data-testid="button-services-lashes">Termin anfragen <ArrowUpRight size={16} /></button>
              <div className="service-watermark">W</div>
            </article>
          </div>
        </section>

        <section className="editorial-band">
          <div className="editorial-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> Die Idee</p>
            <blockquote>„Das Detail macht<br /><em>den Unterschied.</em>”</blockquote>
            <p>Ein ruhiger Ort für deine Beauty-Routine. Mit einem Blick für Form, Farbe und das, was dich besonders macht.</p>
          </div>
          <div className="editorial-image-wrap"><img src={images.beautyProfile} alt="Feines Wimpernstyling im warmen Seitenlicht" width="900" height="650" loading="lazy" /><span className="editorial-stamp">I<br /><small>S</small></span></div>
        </section>

        <section className="section gallery-section" id="galerie">
          <div className="gallery-heading">
            <div><p className="eyebrow"><span className="eyebrow-line" /> Galerie</p><h2>Unsere<br /><em>Arbeiten.</em></h2></div>
            <p>Ein kleiner Einblick in unsere Welt aus Farbe, Form und feinen Details.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <button key={image.src} className={`gallery-item ${image.className}`} onClick={() => setLightboxIndex(index)} data-testid={`button-gallery-${index}`}>
                <img src={image.src} alt={image.alt} width="900" height="1100" loading="lazy" />
                <span className="gallery-demo-badge">Demo</span>
                <span className="gallery-overlay"><span>{image.label}</span><ArrowUpRight size={17} /></span>
              </button>
            ))}
          </div>
          <p className="gallery-note">Demo-Aufnahmen zur Veranschaulichung — keine tatsächlichen Arbeiten oder Kundinnenergebnisse von INN STYLE.</p>
        </section>

        <section className="about-section" id="ueber-uns">
          <div className="about-image"><img src={images.manicure} alt="Gepflegte Maniküre mit glossy Blush-Finish" width="850" height="1050" loading="lazy" /><span className="image-index">02 / 04</span></div>
          <div className="about-copy"><p className="eyebrow"><span className="eyebrow-line" /> Über INN STYLE</p><h2>Schönheit bis<br /><em>ins Detail.</em></h2><p>Deine Hände und dein Blick erzählen deine Geschichte. Wir nehmen uns Zeit für Formen, Farben und ein Ergebnis, das sich nach dir anfühlt.</p><p>Individuelles Styling, präzises Handwerk und persönliche Aufmerksamkeit — mitten in Wasserburg am Inn.</p><button className="text-link" onClick={openAppointment} data-testid="link-about-appointment">Deinen Termin anfragen <MoveRight size={17} /></button></div>
        </section>

        <section className="review-section" id="bewertungen">
          <div className="review-mark">“</div>
          <div><p className="eyebrow"><span className="eyebrow-line" /> Stimmen</p><h2>Was Kundinnen<br /><em>sagen</em></h2><p className="review-placeholder">Echte Stimmen unserer Kundinnen folgen hier.<br />Bis dahin findest du alle Bewertungen direkt bei Google.</p><a href="https://www.google.com/search?q=INN+STYLE+Nagel+Wimpernstudio+Wasserburg+am+Inn" target="_blank" rel="noopener noreferrer" className="button button-outline" data-testid="link-google-reviews">Bewertungen auf Google ansehen <ArrowUpRight size={16} /></a></div>
          <div className="review-rating"><span>4,7</span><div className="stars">{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><small>Google Bewertung</small></div>
        </section>

        <section className="contact-section" id="kontakt">
          <div className="contact-inner">
            <div className="contact-heading"><p className="eyebrow"><span className="eyebrow-line" /> Kontakt</p><h2>Bereit für<br /><em>deinen Style?</em></h2><p>Wir freuen uns auf deine Anfrage — ganz unkompliziert per WhatsApp oder Telefon.</p></div>
            <div className="contact-actions"><button className="button button-cream" onClick={openAppointment} data-testid="button-contact-appointment">Termin anfragen <ArrowUpRight size={16} /></button><a className="contact-direct" href={CONTACT.phoneHref} data-testid="link-contact-phone"><Phone size={16} /> {CONTACT.phoneDisplay}</a><p className="provisional-note">Telefonnummer vorläufig — bitte vor Livegang durch die Inhaberin bestätigen.</p></div>
            <div className="address-block"><MapPin size={20} strokeWidth={1.4} /><div><strong>INN STYLE</strong><span>Nagel &amp; Wimpernstudio</span><span>Weberzipfel 19</span><span>83512 Wasserburg am Inn</span></div><a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer" className="map-link" data-testid="link-route">Route öffnen <ArrowUpRight size={15} /></a></div>
          </div>
        </section>

        <section className="map-section" aria-label="Standort">
          <div className="map-overlay"><span className="map-pin"><MapPin size={17} /></span><div><strong>Weberzipfel 19</strong><span>83512 Wasserburg am Inn</span></div><a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer" data-testid="link-map-directions">Route öffnen <ChevronRight size={15} /></a></div>
          <div className="map-lines" /><div className="map-water" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><span className="map-label label-one">Inn</span><span className="map-label label-two">Wasserburg am Inn</span>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main"><div><div className="footer-brand">INN STYLE</div><p>Nagel &amp; Wimpernstudio<br />Wasserburg am Inn</p></div><div className="footer-nav"><span className="footer-label">Navigation</span><button onClick={() => scrollToId('start')} data-testid="link-footer-start">Start</button><button onClick={() => scrollToId('leistungen')} data-testid="link-footer-services">Leistungen</button><button onClick={() => scrollToId('galerie')} data-testid="link-footer-gallery">Galerie</button><button onClick={() => scrollToId('kontakt')} data-testid="link-footer-contact">Kontakt</button></div><div className="footer-nav"><span className="footer-label">Rechtliches</span><a href="#impressum" data-testid="link-impressum">Impressum <span>folgt</span></a><a href="#datenschutz" data-testid="link-datenschutz">Datenschutz <span>folgt</span></a></div><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="instagram-link" aria-label="Instagram öffnen" data-testid="link-instagram"><Instagram size={20} /></a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} INN STYLE</span><span>Made for your next favorite look.</span><button onClick={() => scrollToId('start')} aria-label="Nach oben" data-testid="button-back-to-top"><ArrowUp size={15} /></button></div>
      </footer>

      <button
        className={`mobile-sticky-cta${!stickyCtaReady || stickyCtaHidden ? ' is-hidden' : ''}`}
        onClick={openAppointment}
        data-testid="button-mobile-appointment"
        aria-hidden={!stickyCtaReady || stickyCtaHidden}
        tabIndex={!stickyCtaReady || stickyCtaHidden ? -1 : undefined}
      >
        Termin anfragen <ArrowUpRight size={16} />
      </button>

      {appointmentOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAppointmentOpen(false); }}><section className="appointment-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-title"><button className="modal-close" onClick={() => setAppointmentOpen(false)} aria-label="Dialog schließen" data-testid="button-close-appointment"><X size={20} /></button>{sent ? <div className="sent-state"><div className="sent-icon"><Check size={23} /></div><p className="eyebrow">Fast geschafft</p><h2>Deine Anfrage<br /><em>ist vorbereitet.</em></h2><p>Wähle jetzt WhatsApp oder rufe direkt an, um deine Anfrage zu senden.</p><div className="modal-actions"><a href={`${CONTACT.whatsappHref}?text=${encodeURIComponent(form.message)}`} target="_blank" rel="noopener noreferrer" className="button button-dark" data-testid="link-whatsapp-send"><MessageCircle size={17} /> Über WhatsApp senden</a><a href={CONTACT.phoneHref} className="button button-outline" data-testid="link-modal-call"><Phone size={16} /> Anrufen</a></div><button className="text-link modal-edit" onClick={() => setSent(false)} data-testid="button-edit-request">Anfrage bearbeiten <MoveRight size={16} /></button></div> : <><p className="eyebrow"><span className="eyebrow-line" /> Termin anfragen</p><h2 id="appointment-title">Dein nächster<br /><em>Lieblingslook.</em></h2><p className="modal-intro">Füll kurz die Felder aus — deine Nachricht ist gleich fertig vorbereitet.</p><div className="form-grid"><label>Behandlung<select value={form.treatment} onChange={(event) => { const value = event.target.value; updateForm('treatment', value); syncMessage(value, form.date, form.name); }} data-testid="select-treatment"><option>Noch offen</option><option>Nägel</option><option>Wimpern</option><option>Nägel &amp; Wimpern</option></select></label><label>Wunschtermin<input type="text" placeholder="z. B. Freitag, 14 Uhr" value={form.date} onChange={(event) => { const value = event.target.value; updateForm('date', value); syncMessage(form.treatment, value, form.name); }} data-testid="input-date" /></label><label>Name<input type="text" placeholder="Dein Name" value={form.name} onChange={(event) => { const value = event.target.value; updateForm('name', value); syncMessage(form.treatment, form.date, value); }} data-testid="input-name" /></label><label className="message-label">Nachricht<textarea value={form.message} onChange={(event) => updateForm('message', event.target.value)} rows={5} data-testid="textarea-message" /></label></div><button className="button button-dark modal-submit" onClick={() => setSent(true)} data-testid="button-prepare-request">Nachricht vorbereiten <ArrowUpRight size={16} /></button><div className="modal-alternatives"><span>Oder direkt</span><a href={CONTACT.phoneHref} data-testid="link-modal-phone"><Phone size={14} /> Anrufen</a><a href={`${CONTACT.whatsappHref}?text=${encodeURIComponent(form.message)}`} target="_blank" rel="noopener noreferrer" data-testid="link-modal-whatsapp"><MessageCircle size={14} /> WhatsApp</a></div><p className="modal-note">WhatsApp-Nummer vorläufig — bitte vor Livegang bestätigen.</p></>}</section></div>}

      {lightboxIndex !== null && <div className="lightbox-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxIndex(null); }}><button className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Galerie schließen" data-testid="button-close-lightbox"><CircleX size={24} /></button><button className="lightbox-arrow lightbox-prev" onClick={() => setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)} aria-label="Vorheriges Bild" data-testid="button-lightbox-prev">←</button><figure className="lightbox-figure"><img src={gallery[lightboxIndex].src} alt={gallery[lightboxIndex].alt} /><figcaption>{gallery[lightboxIndex].label}<span>{String(lightboxIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span></figcaption></figure><button className="lightbox-arrow lightbox-next" onClick={() => setLightboxIndex((lightboxIndex + 1) % gallery.length)} aria-label="Nächstes Bild" data-testid="button-lightbox-next">→</button></div>}
    </div>
  );
}

export default App;
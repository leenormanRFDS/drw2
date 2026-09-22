/**
 * THE BOMBING OF DARWIN — HISTORICAL SPATIAL ENGINE
 * Spatial Representative Asset System
 * 
 * Provides performant, archival-compliant representative visual assets for CesiumJS.
 * Governed by TRUTH, EXPERIENCE & DESIGN authorities.
 * 
 * Aesthetic Rules:
 * - Palette: Muted bone (#ECE7DB), aged gold (#C6A15B), dark graphite (#1B1B18), subtle brass (#9A7E47).
 * - Archival precision: clean linework, no game-like neon, no military HUD crosshairs.
 * - Semantic distinction: What the object represents vs. where history proves it was.
 */

export interface CarrierSilhouetteOptions {
  name: string;
  isFlagship?: boolean;
}

export class SpatialRepresentativeAssets {
  private static carrierTextures: Map<string, string> = new Map();
  private static destroyerTexture: string | null = null;
  private static zeroTexture: string | null = null;
  private static valTexture: string | null = null;
  private static kateTexture: string | null = null;
  private static bettyTexture: string | null = null;
  private static nellTexture: string | null = null;
  private static aircraftTexture: string | null = null;
  private static bomberTexture: string | null = null;
  private static wreckTexture: string | null = null;
  private static missionTexture: string | null = null;
  private static postOfficeTexture: string | null = null;

  /**
   * Generates a high-DPI plan-view silhouette texture of an IJN fleet carrier
   * with historically differentiated planform, island position, and smoke funnels:
   * - AKAGI: Port-side island forward, starboard downward curved funnel, tapered bow flight deck (~260m).
   * - KAGA: Starboard island forward, massive starboard downward funnel duct (~248m).
   * - SORYU: Starboard island forward, sleek cruiser-type hull, twin starboard funnels (~227m).
   * - HIRYU: Port-side island amidships (unique arrangement), twin starboard funnels (~227m).
   */
  public static getCarrierTexture(options: CarrierSilhouetteOptions): string {
    const key = `${options.name}-${options.isFlagship ? 'flag' : 'sub'}`;
    if (this.carrierTextures.has(key)) {
      return this.carrierTextures.get(key)!;
    }

    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(160, 40);

    const isAkagi = options.name === 'AKAGI';
    const isKaga = options.name === 'KAGA';
    const isSoryu = options.name === 'SORYU';
    const isHiryu = options.name === 'HIRYU';

    // Deck dimensions per ship class
    const deckHalfLen = isAkagi ? 135 : isKaga ? 128 : 118;
    const deckHalfWidth = isKaga ? 18 : isAkagi ? 17 : isHiryu ? 15 : 14;

    // Flight deck polygon (characteristic IJN wooden flight deck shape)
    ctx.beginPath();
    ctx.moveTo(-deckHalfLen, -deckHalfWidth);
    ctx.lineTo(deckHalfLen - 25, -deckHalfWidth);
    ctx.lineTo(deckHalfLen, -deckHalfWidth + 6);
    ctx.lineTo(deckHalfLen, deckHalfWidth - 6);
    ctx.lineTo(deckHalfLen - 25, deckHalfWidth);
    ctx.lineTo(-deckHalfLen, deckHalfWidth);
    ctx.lineTo(-deckHalfLen - 7, 0);
    ctx.closePath();

    ctx.fillStyle = '#17181A';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = options.isFlagship ? '#C6A15B' : 'rgba(198, 161, 91, 0.65)';
    ctx.stroke();

    // Flight deck centerline & elevator outlines
    ctx.strokeStyle = 'rgba(236, 231, 219, 0.40)';
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(-deckHalfLen + 10, 0);
    ctx.lineTo(deckHalfLen - 10, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3 aircraft elevators (fore, mid, aft)
    const elevators = [deckHalfLen - 50, 0, -deckHalfLen + 45];
    ctx.fillStyle = 'rgba(236, 231, 219, 0.12)';
    ctx.strokeStyle = 'rgba(236, 231, 219, 0.35)';
    for (const ex of elevators) {
      ctx.fillRect(ex - 6, -6, 12, 12);
      ctx.strokeRect(ex - 6, -6, 12, 12);
    }

    // Island Superstructure location:
    // Akagi: Port side forward (Y negative = port)
    // Hiryu: Port side amidships
    // Kaga / Soryu: Starboard side forward (Y positive = starboard)
    let islandX = 30;
    let islandY = -deckHalfWidth - 4; // default port
    if (isHiryu) {
      islandX = -10;
      islandY = -deckHalfWidth - 4;
    } else if (isKaga || isSoryu) {
      islandX = 25;
      islandY = deckHalfWidth - 4; // starboard
    }

    ctx.fillStyle = '#C6A15B';
    ctx.fillRect(islandX, islandY, 22, 8);
    ctx.strokeStyle = '#ECE7DB';
    ctx.lineWidth = 1;
    ctx.strokeRect(islandX, islandY, 22, 8);

    // Downward-curved smoke funnels on starboard side (Y positive)
    ctx.fillStyle = 'rgba(27, 27, 24, 0.9)';
    ctx.strokeStyle = '#C6A15B';
    if (isAkagi) {
      // Akagi massive downward funnel amidships
      ctx.beginPath();
      ctx.rect(0, deckHalfWidth, 24, 6);
      ctx.fill();
      ctx.stroke();
    } else if (isKaga) {
      // Kaga elongated funnel duct
      ctx.beginPath();
      ctx.rect(-30, deckHalfWidth, 42, 6);
      ctx.fill();
      ctx.stroke();
    } else {
      // Soryu / Hiryu twin angled funnels
      ctx.beginPath();
      ctx.rect(5, deckHalfWidth, 14, 5);
      ctx.rect(23, deckHalfWidth, 12, 5);
      ctx.fill();
      ctx.stroke();
    }

    // AA Gun sponsons (outboard platforms)
    ctx.fillStyle = 'rgba(198, 161, 91, 0.55)';
    const sponsonX = [-70, -35, 60];
    for (const sx of sponsonX) {
      ctx.beginPath();
      ctx.arc(sx, -deckHalfWidth - 2, 3.5, 0, Math.PI * 2);
      ctx.arc(sx, deckHalfWidth + 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Designation
    ctx.font = '600 10px "Museo Sans", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#ECE7DB';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.name + (options.isFlagship ? ' (FLAGSHIP)' : ''), 0, 0);

    ctx.restore();

    const dataUrl = canvas.toDataURL();
    this.carrierTextures.set(key, dataUrl);
    return dataUrl;
  }

  /**
   * Generates a plan-view silhouette of USS Peary (Clemson-class four-stack destroyer).
   */
  public static getDestroyerTexture(): string {
    if (this.destroyerTexture) return this.destroyerTexture;
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(120, 30);

    // Slender flush-deck hull
    ctx.beginPath();
    ctx.moveTo(105, 0); // sharp bow
    ctx.lineTo(80, -10);
    ctx.lineTo(-85, -10);
    ctx.lineTo(-100, -6);
    ctx.lineTo(-105, 0); // rounded cruiser stern
    ctx.lineTo(-100, 6);
    ctx.lineTo(-85, 10);
    ctx.lineTo(80, 10);
    ctx.closePath();

    ctx.fillStyle = '#1D1E20';
    ctx.fill();
    ctx.strokeStyle = '#C6A15B';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Bridge structure forward
    ctx.fillStyle = '#C6A15B';
    ctx.fillRect(40, -7, 18, 14);

    // Forward 4-inch gun mount
    ctx.beginPath();
    ctx.arc(70, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Four characteristic Clemson-class vertical funnels (four-piper)
    ctx.fillStyle = '#ECE7DB';
    for (let x = 20; x >= -25; x -= 15) {
      ctx.beginPath();
      ctx.ellipse(x, 0, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1B1B18';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Aft deckhouse and depth-charge racks
    ctx.fillStyle = 'rgba(198, 161, 91, 0.7)';
    ctx.fillRect(-65, -6, 20, 12);
    ctx.fillRect(-98, -4, 10, 8);

    // Vessel designation
    ctx.font = '500 9px "Museo Sans", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = '#ECE7DB';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('USS PEARY (DD-226)', 0, -14);

    ctx.restore();

    this.destroyerTexture = canvas.toDataURL();
    return this.destroyerTexture;
  }

  /**
   * Generates plan silhouette of Mitsubishi A6M2 Zero (Type 0 Carrier Fighter).
   * Key visual traits: Sleek tapered wings with rounded wingtips, compact fuselage,
   * Sakae 12 radial engine cowl, high-speed escort profile.
   */
  public static getZeroTexture(): string {
    if (this.zeroTexture) return this.zeroTexture;
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 56;
    canvas.height = 56;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(28, 28);

    // Fuselage
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings (straight leading edge, gentle forward sweep on trailing edge, rounded tips)
    ctx.beginPath();
    ctx.moveTo(3, -21);
    ctx.quadraticCurveTo(4, -22, 1, -22);
    ctx.lineTo(-4, -18);
    ctx.lineTo(-4, 18);
    ctx.lineTo(1, 22);
    ctx.quadraticCurveTo(4, 22, 3, 21);
    ctx.lineTo(3, 0);
    ctx.closePath();
    ctx.fill();

    // Horizontal stabilizer (rounded)
    ctx.beginPath();
    ctx.moveTo(-12, -7);
    ctx.lineTo(-12, 7);
    ctx.lineTo(-15, 6);
    ctx.lineTo(-15, -6);
    ctx.closePath();
    ctx.fill();

    // Engine Cowling accent (dark graphite cowl + gold propeller spinner)
    ctx.fillStyle = '#1D1E20';
    ctx.beginPath();
    ctx.arc(14, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#C6A15B';
    ctx.beginPath();
    ctx.arc(16, 0, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    this.zeroTexture = canvas.toDataURL();
    return this.zeroTexture;
  }

  /**
   * Generates plan silhouette of Aichi D3A1 Val (Type 99 Carrier Dive Bomber).
   * Key visual traits: Characteristic elliptical Heinkel-style wings,
   * prominent fixed spatted landing gear protruding ahead of wing leading edge.
   */
  public static getValTexture(): string {
    if (this.valTexture) return this.valTexture;
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 56;
    canvas.height = 56;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(28, 28);

    // Fuselage with dorsal fin fillet
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 3.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Elliptical wings (distinctive curved outline)
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fixed spatted landing gear (prominent forward streamlined fairings)
    ctx.fillStyle = '#C6A15B';
    ctx.beginPath();
    ctx.ellipse(6, -8, 4.5, 2, 0, 0, Math.PI * 2);
    ctx.ellipse(6, 8, 4.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Elliptical tailplane
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.ellipse(-13, 0, 3, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Engine Cowl
    ctx.fillStyle = '#1B1B18';
    ctx.beginPath();
    ctx.arc(15, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    this.valTexture = canvas.toDataURL();
    return this.valTexture;
  }

  /**
   * Generates plan silhouette of Nakajima B5N2 Kate (Type 97 Carrier Attack Bomber).
   * Key visual traits: Wide wingspan (widest carrier single-engine), straight taper,
   * elongated greenhouse canopy, centerline bomb/torpedo profile.
   */
  public static getKateTexture(): string {
    if (this.kateTexture) return this.kateTexture;
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 60;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(30, 30);

    // Fuselage
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.ellipse(0, 0, 19, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Three-seat greenhouse canopy line
    ctx.fillStyle = '#1D1E20';
    ctx.fillRect(-6, -1.5, 12, 3);

    // Wide trapezoidal wings with straight taper and rounded tips (~15.5m span)
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.moveTo(3, -26);
    ctx.lineTo(3, 26);
    ctx.lineTo(-6, 21);
    ctx.lineTo(-6, -21);
    ctx.closePath();
    ctx.fill();

    // Centerline heavy bomb / torpedo payload indicator
    ctx.fillStyle = '#C6A15B';
    ctx.fillRect(-4, -1, 10, 2);

    // Horizontal stabilizer
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.moveTo(-14, -9);
    ctx.lineTo(-14, 9);
    ctx.lineTo(-18, 7.5);
    ctx.lineTo(-18, -7.5);
    ctx.closePath();
    ctx.fill();

    // Cowl
    ctx.fillStyle = '#1B1B18';
    ctx.beginPath();
    ctx.arc(16, 0, 3.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    this.kateTexture = canvas.toDataURL();
    return this.kateTexture;
  }

  /**
   * Generates plan silhouette of single-engine naval strike aircraft (Kate default).
   */
  public static getAircraftTexture(): string {
    return this.getKateTexture();
  }

  /**
   * Generates plan silhouette of Mitsubishi G4M1 Betty (Type 1 Land Attack Bomber).
   * Key visual traits: Large cigar-shaped fuselage ("flying cigar"), twin Mitsubishi Kasei radials,
   * broad trapezoidal mid-wings, glass nose and tail cone turret.
   */
  public static getBettyTexture(): string {
    if (this.bettyTexture) return this.bettyTexture;
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 72;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(36, 36);

    // Broad cigar fuselage
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 5.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glazed nose and tail turret accents
    ctx.fillStyle = 'rgba(27, 27, 24, 0.7)';
    ctx.beginPath();
    ctx.arc(22, 0, 3, 0, Math.PI * 2);
    ctx.arc(-24, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Large tapered wings
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.moveTo(6, -32);
    ctx.lineTo(6, 32);
    ctx.lineTo(-8, 26);
    ctx.lineTo(-8, -26);
    ctx.closePath();
    ctx.fill();

    // Twin engine nacelles (Kasei radials)
    ctx.fillStyle = '#C6A15B';
    ctx.beginPath();
    ctx.ellipse(7, -13, 9, 3.8, 0, 0, Math.PI * 2);
    ctx.ellipse(7, 13, 9, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#17181A';
    ctx.beginPath();
    ctx.arc(14, -13, 3, 0, Math.PI * 2);
    ctx.arc(14, 13, 3, 0, Math.PI * 2);
    ctx.fill();

    // Tail horizontal stabilizer (single large vertical fin layout)
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.moveTo(-18, -14);
    ctx.lineTo(-18, 14);
    ctx.lineTo(-24, 12);
    ctx.lineTo(-24, -12);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
    this.bettyTexture = canvas.toDataURL();
    return this.bettyTexture;
  }

  /**
   * Generates plan silhouette of Mitsubishi G3M2 Nell (Type 96 Land Attack Bomber).
   * Key visual traits: Slender fuselage, distinctive twin vertical fins/rudders
   * mounted on the outer edges of the horizontal stabilizer.
   */
  public static getNellTexture(): string {
    if (this.nellTexture) return this.nellTexture;
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 72;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(36, 36);

    // Slender fuselage
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.beginPath();
    ctx.moveTo(5, -31);
    ctx.lineTo(5, 31);
    ctx.lineTo(-7, 25);
    ctx.lineTo(-7, -25);
    ctx.closePath();
    ctx.fill();

    // Twin engine nacelles
    ctx.fillStyle = '#C6A15B';
    ctx.beginPath();
    ctx.ellipse(6, -12, 8, 3.4, 0, 0, Math.PI * 2);
    ctx.ellipse(6, 12, 8, 3.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Horizontal stabilizer with distinctive TWIN vertical fins at extremities
    ctx.fillStyle = '#ECE7DB';
    ctx.beginPath();
    ctx.moveTo(-17, -15);
    ctx.lineTo(-17, 15);
    ctx.lineTo(-22, 13);
    ctx.lineTo(-22, -13);
    ctx.closePath();
    ctx.fill();

    // Twin endplate rudders (G3M Nell signature)
    ctx.fillStyle = '#1D1E20';
    ctx.fillRect(-22, -16, 6, 2.5);
    ctx.fillRect(-22, 13.5, 6, 2.5);

    ctx.restore();
    this.nellTexture = canvas.toDataURL();
    return this.nellTexture;
  }

  /**
   * Generates plan silhouette of twin-engine naval land bomber (Betty default).
   */
  public static getBomberTexture(): string {
    return this.getBettyTexture();
  }

  /**
   * Generates a modern hydrographic chart wreck symbol (Chart Aus 26 standard).
   */
  public static getWreckSymbolTexture(depthM?: number): string {
    if (!depthM && this.wreckTexture) return this.wreckTexture;
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(32, 32);

    // Circular sounding contour
    ctx.strokeStyle = 'rgba(198, 161, 91, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(238, 233, 223, 0.08)';
    ctx.fill();

    // Nautical sunken hull symbol: dashed submerged keel with vertical mast cross
    ctx.strokeStyle = '#ECE7DB';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.lineTo(-8, 10);
    ctx.moveTo(8, -10);
    ctx.lineTo(8, 10);
    ctx.stroke();

    // Depth numeral annotation if provided
    if (depthM) {
      ctx.font = 'bold 9px "Museo Sans", -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#C6A15B';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${depthM}m`, 0, 16);
    }

    ctx.restore();

    const dataUrl = canvas.toDataURL();
    if (!depthM) this.wreckTexture = dataUrl;
    return dataUrl;
  }
}

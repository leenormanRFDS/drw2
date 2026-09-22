/**
 * THE BOMBING OF DARWIN — HISTORICAL SPATIAL ENGINE
 * Spatial Representative Formation Controller
 * 
 * Governed by TRUTH, EXPERIENCE, DESIGN & TECHNOLOGY authorities.
 * 
 * First Principles:
 * 1. Historical Scale Perceptible: Visualizes the scale of the 188-aircraft First Wave
 *    and 54-aircraft Second Wave without inventing false GPS telemetry.
 * 2. Visual Restraint: Archival, physical, restrained silhouettes (Zero, Val, Kate, Betty, Nell).
 * 3. Discrete Densities: Evaluates 12, 24, and 36 aircraft configurations for Beat 0;
 *    12 and 18 configurations for Beat 5.
 * 4. Motion-to-Stillness: Brief authored advance (2.2s cubic deceleration) establishing
 *    altitude and direction, then settling into absolute zero-render stillness.
 * 5. Mobile Framing: Maintains vertical clearance above bottom cards.
 */

import type * as CesiumType from 'cesium';
import type { SpatialDemonstrationStateId } from './spatial-types';
import { SpatialRepresentativeAssets } from './spatial-representative-assets';

export type FormationDensityBeat0 = 'LOW' | 'MEDIUM' | 'HIGH';
export type FormationDensityBeat5 = 'LOW' | 'HIGH';

export interface FormationAircraftDef {
  id: string;
  type: 'ZERO' | 'VAL' | 'KATE' | 'BETTY' | 'NELL';
  targetLon: number;
  targetLat: number;
  altitudeM: number;
  headingDeg: number;
  layer: 'LOW_COVER' | 'MID_STRIKE' | 'HIGH_COVER' | 'LEAD_ECHELON' | 'TRAIL_ECHELON';
}

export class SpatialFormationController {
  private Cesium: typeof CesiumType;
  private viewer: CesiumType.Viewer;
  private dataSource: CesiumType.CustomDataSource;

  // Active density configurations
  private beat0Density: FormationDensityBeat0 = 'HIGH'; // 36 aircraft default
  private beat5Density: FormationDensityBeat5 = 'HIGH'; // 18 bombers default

  // Entities managed by this controller
  private beat0Entities: CesiumType.Entity[] = [];
  private beat5Entities: CesiumType.Entity[] = [];

  // Motion-to-stillness animation state
  private motionTimer: any = null;
  private isMotionActive: boolean = false;
  private activeBeat: SpatialDemonstrationStateId | null = null;
  private isReducedMotion: boolean = false;

  constructor(
    Cesium: typeof CesiumType,
    viewer: CesiumType.Viewer,
    dataSource: CesiumType.CustomDataSource
  ) {
    this.Cesium = Cesium;
    this.viewer = viewer;
    this.dataSource = dataSource;

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.isReducedMotion = mediaQuery.matches;
      mediaQuery.addEventListener('change', (e) => {
        this.isReducedMotion = e.matches;
      });
    }
  }

  public initialize(): void {
    this.buildBeat0Formations();
    this.buildBeat5Formations();
    this.hideAll();
  }

  /**
   * Builds Beat 0 First Wave Strike Formation (Timor Sea assembly).
   * Documented total: 188 aircraft (81 level bombers, 71 dive bombers, 36 fighters).
   * Tactical altitudes:
   * - Level bombers (B5N2 Kate): 3,200m – 3,400m
   * - Dive bombers (D3A1 Val): 3,800m – 4,100m
   * - Fighter escort (A6M2 Zero): 4,500m – 4,800m
   * Heading: 140° (southeast toward Bathurst Island).
   */
  private buildBeat0Formations(): void {
    const Cesium = this.Cesium;
    const centerLon = 129.35;
    const centerLat = -10.72;
    const heading = 140;

    const kateTexture = SpatialRepresentativeAssets.getKateTexture();
    const valTexture = SpatialRepresentativeAssets.getValTexture();
    const zeroTexture = SpatialRepresentativeAssets.getZeroTexture();

    const defs = this.generateBeat0Definitions(centerLon, centerLat, heading);

    for (const d of defs) {
      const image = d.type === 'ZERO' ? zeroTexture : d.type === 'VAL' ? valTexture : kateTexture;
      const size = d.type === 'ZERO' ? 30 : d.type === 'VAL' ? 32 : 35;

      const entity = this.dataSource.entities.add({
        name: `beat0-${d.type}-${d.id}`,
        properties: new Cesium.PropertyBag({
          aircraftDef: d,
          ledgerData: {
            id: 'representative-aircraft-formation-wave1',
            title: `First Wave Strike Formation (${d.type === 'ZERO' ? 'A6M2 Zero Fighter' : d.type === 'VAL' ? 'D3A1 Val Dive Bomber' : 'B5N2 Kate Level Bomber'})`,
            classification: 'REPRESENTATIVE_FORMATION',
            confidence: 'HISTORICAL_ESTIMATION',
            time: '08:00',
            badge: 'REPRESENTATIVE FORMATION',
            known: 'The First Wave comprised 188 naval aircraft launched from 4 fleet carriers in the Timor Sea: 81 B5N2 level bombers, 71 D3A1 dive bombers, and 36 A6M2 fighters.',
            uncertain: 'Individual aircraft flight paths and exact spacing within chutai flights are representative tactical reconstructions, not observed radar tracks.',
            notes: 'Aircraft stepped in 3 distinct altitude bands (3,200m to 4,800m) following standard IJN naval strike doctrine.',
            sources: [
              { title: 'Senshi Sōsho Vol. 26', institution: 'Japanese Official History' },
              { title: 'Australian War Memorial (AWM 54)', institution: 'Official Records' }
            ]
          }
        }),
        position: Cesium.Cartesian3.fromDegrees(d.targetLon, d.targetLat, d.altitudeM),
        billboard: {
          image: image || undefined,
          width: size,
          height: size,
          alignedAxis: Cesium.Cartesian3.UNIT_Z,
          rotation: Cesium.Math.toRadians(heading),
          scaleByDistance: new Cesium.NearFarScalar(5e4, 1.25, 3e6, 0.7),
        },
        show: false,
      });

      this.beat0Entities.push(entity);
    }
  }

  /**
   * Generates tactical definition coordinates for Beat 0 according to active density.
   */
  private generateBeat0Definitions(
    centerLon: number,
    centerLat: number,
    headingDeg: number
  ): FormationAircraftDef[] {
    const list: FormationAircraftDef[] = [];
    // Transform offsets along heading vector (140 deg: rad = 140 * PI / 180)
    // Forward unit vector: dx = sin(rad), dy = -cos(rad)
    // Right orthogonal vector: rx = cos(rad), ry = sin(rad)
    const rad = (headingDeg * Math.PI) / 180;
    const fwdX = Math.sin(rad);
    const fwdY = -Math.cos(rad);
    const rgtX = Math.cos(rad);
    const rgtY = Math.sin(rad);

    // Degree scale: ~1 deg lat = 111km; at lat -10.7, 1 deg lon = ~109km
    const kmToLon = 1 / 109;
    const kmToLat = 1 / 111;

    const addAircraft = (
      type: 'ZERO' | 'VAL' | 'KATE',
      fwdKm: number,
      rgtKm: number,
      altitudeM: number,
      layer: 'LOW_COVER' | 'MID_STRIKE' | 'HIGH_COVER'
    ) => {
      const dLon = (fwdKm * fwdX + rgtKm * rgtX) * kmToLon;
      const dLat = (fwdKm * fwdY + rgtKm * rgtY) * kmToLat;
      list.push({
        id: `ac-${list.length}`,
        type,
        targetLon: centerLon + dLon,
        targetLat: centerLat + dLat,
        altitudeM,
        headingDeg,
        layer,
      });
    };

    // 1. Level Bombers (Nakajima B5N2 Kate) - Leading strike element at 3,200m–3,400m
    // Chutai 1 (V of 3)
    addAircraft('KATE', 0, 0, 3250, 'LOW_COVER');
    addAircraft('KATE', -1.4, -1.8, 3280, 'LOW_COVER');
    addAircraft('KATE', -1.4, 1.8, 3280, 'LOW_COVER');
    // Chutai 2 (V of 3 stepped right)
    addAircraft('KATE', -3.2, 3.8, 3320, 'LOW_COVER');
    if (this.beat0Density !== 'LOW') {
      addAircraft('KATE', -4.6, 2.0, 3350, 'LOW_COVER');
      addAircraft('KATE', -4.6, 5.6, 3350, 'LOW_COVER');
      // Chutai 3 (V of 3 stepped left)
      addAircraft('KATE', -3.2, -3.8, 3320, 'LOW_COVER');
      addAircraft('KATE', -4.6, -5.6, 3350, 'LOW_COVER');
      addAircraft('KATE', -4.6, -2.0, 3350, 'LOW_COVER');
    }
    if (this.beat0Density === 'HIGH') {
      // 5 additional level bombers in trail chutai
      addAircraft('KATE', -6.5, -1.8, 3380, 'LOW_COVER');
      addAircraft('KATE', -6.5, 1.8, 3380, 'LOW_COVER');
      addAircraft('KATE', -8.0, 0, 3400, 'LOW_COVER');
      addAircraft('KATE', -8.0, -3.8, 3400, 'LOW_COVER');
      addAircraft('KATE', -8.0, 3.8, 3400, 'LOW_COVER');
    }

    // 2. Dive Bombers (Aichi D3A1 Val) - Stepped above & behind at 3,800m–4,100m
    addAircraft('VAL', -2.5, -8.0, 3850, 'MID_STRIKE');
    addAircraft('VAL', -3.9, -9.8, 3880, 'MID_STRIKE');
    addAircraft('VAL', -3.9, -6.2, 3880, 'MID_STRIKE');
    addAircraft('VAL', -5.5, -8.0, 3920, 'MID_STRIKE');
    if (this.beat0Density !== 'LOW') {
      addAircraft('VAL', -2.5, 8.0, 3850, 'MID_STRIKE');
      addAircraft('VAL', -3.9, 6.2, 3880, 'MID_STRIKE');
      addAircraft('VAL', -3.9, 9.8, 3880, 'MID_STRIKE');
      addAircraft('VAL', -5.5, 8.0, 3920, 'MID_STRIKE');
      addAircraft('VAL', -7.0, -8.0, 3960, 'MID_STRIKE');
    }
    if (this.beat0Density === 'HIGH') {
      addAircraft('VAL', -7.0, 8.0, 3960, 'MID_STRIKE');
      addAircraft('VAL', -8.5, -9.8, 4000, 'MID_STRIKE');
      addAircraft('VAL', -8.5, -6.2, 4000, 'MID_STRIKE');
      addAircraft('VAL', -8.5, 6.2, 4000, 'MID_STRIKE');
      addAircraft('VAL', -8.5, 9.8, 4000, 'MID_STRIKE');
    }

    // 3. Fighter Escort (Mitsubishi A6M2 Zero) - High cover at 4,500m–4,800m
    addAircraft('ZERO', 3.0, -3.5, 4550, 'HIGH_COVER');
    addAircraft('ZERO', 3.0, 3.5, 4550, 'HIGH_COVER');
    addAircraft('ZERO', 1.5, -5.5, 4600, 'HIGH_COVER');
    addAircraft('ZERO', 1.5, 5.5, 4600, 'HIGH_COVER');
    if (this.beat0Density !== 'LOW') {
      addAircraft('ZERO', -1.0, -11.0, 4650, 'HIGH_COVER');
      addAircraft('ZERO', -1.0, 11.0, 4650, 'HIGH_COVER');
      addAircraft('ZERO', -3.0, -12.5, 4700, 'HIGH_COVER');
      addAircraft('ZERO', -3.0, 12.5, 4700, 'HIGH_COVER');
    }

    return list;
  }

  /**
   * Builds Beat 5 Second Wave High-Altitude Bomber Formation.
   * Documented total: 54 land-based naval bombers (27 G4M1 Bettys, 27 G3M2 Nells).
   * Tactical altitude: 6,500m (approx 21,300 ft, within 18,000–23,000 ft historical ceiling).
   * Heading: 135° (approaching from Beagle Gulf over Fannie Bay toward Parap airfield).
   */
  private buildBeat5Formations(): void {
    const Cesium = this.Cesium;
    const centerLon = 130.82;
    const centerLat = -12.35;
    const heading = 135;

    const bettyTexture = SpatialRepresentativeAssets.getBettyTexture();
    const nellTexture = SpatialRepresentativeAssets.getNellTexture();

    const defs = this.generateBeat5Definitions(centerLon, centerLat, heading);

    for (const d of defs) {
      const image = d.type === 'BETTY' ? bettyTexture : nellTexture;

      const entity = this.dataSource.entities.add({
        name: `beat5-${d.type}-${d.id}`,
        properties: new Cesium.PropertyBag({
          aircraftDef: d,
          ledgerData: {
            id: 'representative-bomber-formation-wave2',
            title: `Second Wave High-Altitude Bomber (${d.type === 'BETTY' ? 'Mitsubishi G4M1 Betty' : 'Mitsubishi G3M2 Nell'})`,
            classification: 'REPRESENTATIVE_FORMATION',
            confidence: 'HISTORICAL_ESTIMATION',
            time: '12:00',
            badge: 'REPRESENTATIVE FORMATION',
            known: '54 twin-engine land-based naval bombers attacked in two major elements: 27 G4M1 Bettys (1st Kokutai from Kendari) and 27 G3M2 Nells (Takao Kokutai from Ambon).',
            uncertain: 'Exact spacing within the stepped V-echelon formations is reconstructed from standard IJN land-attack doctrine.',
            notes: 'Bombers maintained rigid, undisturbed level flight at 18,000 to 23,000 ft (~6,500m) with zero Allied fighter interception.',
            sources: [
              { title: 'Senshi Sōsho Vol. 26', institution: 'Japanese Official History' },
              { title: 'Lowe Commission Report', institution: 'Official Inquiry (1942)' }
            ]
          }
        }),
        position: Cesium.Cartesian3.fromDegrees(d.targetLon, d.targetLat, d.altitudeM),
        billboard: {
          image: image || undefined,
          width: 44,
          height: 44,
          alignedAxis: Cesium.Cartesian3.UNIT_Z,
          rotation: Cesium.Math.toRadians(heading),
          scaleByDistance: new Cesium.NearFarScalar(5e3, 1.25, 2.5e5, 0.7),
        },
        show: false,
      });

      this.beat5Entities.push(entity);
    }
  }

  /**
   * Generates tactical definition coordinates for Beat 5 (stepped V-echelons).
   */
  private generateBeat5Definitions(
    centerLon: number,
    centerLat: number,
    headingDeg: number
  ): FormationAircraftDef[] {
    const list: FormationAircraftDef[] = [];
    const rad = (headingDeg * Math.PI) / 180;
    const fwdX = Math.sin(rad);
    const fwdY = -Math.cos(rad);
    const rgtX = Math.cos(rad);
    const rgtY = Math.sin(rad);

    const kmToLon = 1 / 108.5;
    const kmToLat = 1 / 111;

    const addBomber = (
      type: 'BETTY' | 'NELL',
      fwdKm: number,
      rgtKm: number,
      altitudeM: number,
      layer: 'LEAD_ECHELON' | 'TRAIL_ECHELON'
    ) => {
      const dLon = (fwdKm * fwdX + rgtKm * rgtX) * kmToLon;
      const dLat = (fwdKm * fwdY + rgtKm * rgtY) * kmToLat;
      list.push({
        id: `bomber-${list.length}`,
        type,
        targetLon: centerLon + dLon,
        targetLat: centerLat + dLat,
        altitudeM,
        headingDeg,
        layer,
      });
    };

    // Lead Echelon: G4M1 Bettys (chutai V of 9 at 6,500m)
    addBomber('BETTY', 0, 0, 6500, 'LEAD_ECHELON');
    addBomber('BETTY', -1.2, -1.4, 6500, 'LEAD_ECHELON');
    addBomber('BETTY', -1.2, 1.4, 6500, 'LEAD_ECHELON');
    addBomber('BETTY', -2.4, -2.8, 6500, 'LEAD_ECHELON');
    addBomber('BETTY', -2.4, 2.8, 6500, 'LEAD_ECHELON');
    addBomber('BETTY', -3.6, -4.2, 6500, 'LEAD_ECHELON');
    addBomber('BETTY', -3.6, 4.2, 6500, 'LEAD_ECHELON');
    if (this.beat5Density === 'HIGH') {
      addBomber('BETTY', -4.8, -5.6, 6500, 'LEAD_ECHELON');
      addBomber('BETTY', -4.8, 5.6, 6500, 'LEAD_ECHELON');
    }

    // Trailing Echelon: G3M2 Nells (stepped up +300m at 6,800m, trailing by ~5km)
    const trailOffsetFwd = -5.5;
    const trailOffsetRgt = 3.5;
    addBomber('NELL', trailOffsetFwd, trailOffsetRgt, 6800, 'TRAIL_ECHELON');
    addBomber('NELL', trailOffsetFwd - 1.2, trailOffsetRgt - 1.4, 6800, 'TRAIL_ECHELON');
    addBomber('NELL', trailOffsetFwd - 1.2, trailOffsetRgt + 1.4, 6800, 'TRAIL_ECHELON');
    addBomber('NELL', trailOffsetFwd - 2.4, trailOffsetRgt - 2.8, 6800, 'TRAIL_ECHELON');
    addBomber('NELL', trailOffsetFwd - 2.4, trailOffsetRgt + 2.8, 6800, 'TRAIL_ECHELON');
    if (this.beat5Density === 'HIGH') {
      addBomber('NELL', trailOffsetFwd - 3.6, trailOffsetRgt - 4.2, 6800, 'TRAIL_ECHELON');
      addBomber('NELL', trailOffsetFwd - 3.6, trailOffsetRgt + 4.2, 6800, 'TRAIL_ECHELON');
      addBomber('NELL', trailOffsetFwd - 4.8, trailOffsetRgt - 5.6, 6800, 'TRAIL_ECHELON');
      addBomber('NELL', trailOffsetFwd - 4.8, trailOffsetRgt + 5.6, 6800, 'TRAIL_ECHELON');
    }

    return list;
  }

  /**
   * Called when camera begins transitioning between beats.
   * Immediately stops any motion animation and hides formation entities.
   */
  public prepareTransition(targetStateId: SpatialDemonstrationStateId): void {
    this.cancelMotion();
    this.activeBeat = null;

    // Keep hidden during flight to prevent visual popping
    for (const ent of this.beat0Entities) ent.show = false;
    for (const ent of this.beat5Entities) ent.show = false;
  }

  /**
   * Called when camera arrives and settles at the authored beat.
   * If Beat 0 or Beat 5, reveals entities and initiates the motion-to-stillness sequence.
   */
  public completeTransition(stateId: SpatialDemonstrationStateId): void {
    this.cancelMotion();
    this.activeBeat = stateId;

    if (stateId === 'BEAT_0_CARRIER_FORCE') {
      this.runMotionToStillnessSequence(this.beat0Entities, 140, 2200, 2600);
    } else if (stateId === 'BEAT_5_RAAF_AIRFIELD') {
      this.runMotionToStillnessSequence(this.beat5Entities, 135, 2000, 1800);
    } else {
      this.hideAll();
    }
  }

  /**
   * Cancels in-flight transition / animation
   */
  public cancelTransition(): void {
    this.cancelMotion();
    this.hideAll();
  }

  /**
   * Motion-to-stillness prototype implementation:
   * 1. Positions aircraft slightly offset along their reverse heading vector (-backwardDistanceM).
   * 2. Shows entities.
   * 3. Animate forward over durationMs using cubic deceleration (easeOutCubic).
   * 4. Upon completion: places at exact target coordinates, cancels all timers,
   *    calls requestRender() one final time, and enters absolute zero-render stillness.
   */
  private runMotionToStillnessSequence(
    entities: CesiumType.Entity[],
    headingDeg: number,
    durationMs: number,
    backwardDistanceM: number
  ): void {
    const Cesium = this.Cesium;

    // If reduced motion is requested, immediately show at settled target without animation
    if (this.isReducedMotion) {
      for (const ent of entities) {
        const def = ent.properties?.getValue(this.viewer.clock.currentTime)?.aircraftDef as FormationAircraftDef;
        if (def) {
          ent.position = new Cesium.ConstantPositionProperty(
            Cesium.Cartesian3.fromDegrees(def.targetLon, def.targetLat, def.altitudeM)
          );
          ent.show = true;
        }
      }
      this.viewer.scene.requestRender();
      return;
    }

    const rad = (headingDeg * Math.PI) / 180;
    const fwdX = Math.sin(rad);
    const fwdY = -Math.cos(rad);

    const kmToLon = 1 / 109;
    const kmToLat = 1 / 111;

    // Show all entities at start
    for (const ent of entities) ent.show = true;

    this.isMotionActive = true;
    const startTime = Date.now();

    this.motionTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1.0, elapsed / durationMs);

      // Cubic deceleration (easeOutCubic): 1 - (1 - p)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      // Distance remaining backward (from -backwardDistanceM to 0)
      const currentOffsetM = -backwardDistanceM * (1 - ease);
      const currentOffsetKm = currentOffsetM / 1000;

      const dLon = currentOffsetKm * fwdX * kmToLon;
      const dLat = currentOffsetKm * fwdY * kmToLat;

      for (const ent of entities) {
        const def = ent.properties?.getValue(this.viewer.clock.currentTime)?.aircraftDef as FormationAircraftDef;
        if (def) {
          ent.position = new Cesium.ConstantPositionProperty(
            Cesium.Cartesian3.fromDegrees(def.targetLon + dLon, def.targetLat + dLat, def.altitudeM)
          );
        }
      }

      this.viewer.scene.requestRender();

      if (progress >= 1.0) {
        this.cancelMotion();

        // Snap to exact target
        for (const ent of entities) {
          const def = ent.properties?.getValue(this.viewer.clock.currentTime)?.aircraftDef as FormationAircraftDef;
          if (def) {
            ent.position = new Cesium.ConstantPositionProperty(
              Cesium.Cartesian3.fromDegrees(def.targetLon, def.targetLat, def.altitudeM)
            );
          }
        }

        // Final render to freeze at absolute stillness
        this.viewer.scene.requestRender();
      }
    }, 25);
  }

  private cancelMotion(): void {
    if (this.motionTimer) {
      clearInterval(this.motionTimer);
      this.motionTimer = null;
    }
    this.isMotionActive = false;
  }

  private hideAll(): void {
    for (const ent of this.beat0Entities) ent.show = false;
    for (const ent of this.beat5Entities) ent.show = false;
  }

  /**
   * Density benchmarking API for Beat 0 (12, 24, or 36 aircraft).
   */
  public setBeat0Density(density: FormationDensityBeat0): void {
    if (this.beat0Density === density) return;
    this.beat0Density = density;

    // Remove old entities from dataSource
    for (const ent of this.beat0Entities) {
      this.dataSource.entities.remove(ent);
    }
    this.beat0Entities = [];

    // Rebuild
    this.buildBeat0Formations();

    if (this.activeBeat === 'BEAT_0_CARRIER_FORCE') {
      for (const ent of this.beat0Entities) ent.show = true;
      this.viewer.scene.requestRender();
    }
  }

  public getBeat0Density(): FormationDensityBeat0 {
    return this.beat0Density;
  }

  public getBeat0AircraftCount(): number {
    return this.beat0Entities.length;
  }

  /**
   * Density benchmarking API for Beat 5 (12 or 18 bombers).
   */
  public setBeat5Density(density: FormationDensityBeat5): void {
    if (this.beat5Density === density) return;
    this.beat5Density = density;

    for (const ent of this.beat5Entities) {
      this.dataSource.entities.remove(ent);
    }
    this.beat5Entities = [];

    this.buildBeat5Formations();

    if (this.activeBeat === 'BEAT_5_RAAF_AIRFIELD') {
      for (const ent of this.beat5Entities) ent.show = true;
      this.viewer.scene.requestRender();
    }
  }

  public getBeat5Density(): FormationDensityBeat5 {
    return this.beat5Density;
  }

  public getBeat5AircraftCount(): number {
    return this.beat5Entities.length;
  }

  public destroy(): void {
    this.cancelMotion();
    for (const ent of this.beat0Entities) {
      this.dataSource.entities.remove(ent);
    }
    for (const ent of this.beat5Entities) {
      this.dataSource.entities.remove(ent);
    }
    this.beat0Entities = [];
    this.beat5Entities = [];
  }
}

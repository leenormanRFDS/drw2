/**
 * THE BOMBING OF DARWIN — HISTORICAL SPATIAL ENGINE
 * Spatial Evidence Overlay & Representative Asset Coordinator
 * 
 * Manages evidence-governed cartographic markers, representative historical objects,
 * and narrative scene choreography in CesiumJS.
 * 
 * Strict Governance Rules:
 * 1. TRUTH FIRST: Every marker, silhouette and boundary corresponds to verified or approximate canonical entities.
 * 2. NEGATIVE CONSTRAINTS:
 *    - NO 1:1 individual aircraft tracks (corridors and representative formations only).
 *    - 1942 Stokes Hill Wharf geometry remains unresolved (null coordinates).
 *    - MV Neptuna 1942 berth remains unresolved (null coordinates).
 *    - NO game-like HUDs, neon target reticles, or radar pulses.
 * 3. AESTHETICS: Restrained, archival, institutional palette (Bone #ECE7DB, Gold #C6A15B, Dark #07090B).
 * 4. TRANSITION LIFECYCLE: Strict phase management (IDLE -> FLYING -> SETTLED) to eliminate label leakage.
 */

import type * as CesiumType from 'cesium';
import type { SpatialDemonstrationStateId } from './spatial-types';
import { SpatialRepresentativeAssets } from './spatial-representative-assets';
import { SpatialFormationController } from './spatial-formation-controller';

export interface EvidenceSource {
  title: string;
  institution?: string;
  reference?: string;
}

export interface LedgerEntityData {
  id: string;
  title: string;
  time?: string;
  badge?: string;
  classification: string;
  confidence: string;
  known: string;
  uncertain?: string;
  notes?: string;
  sources: EvidenceSource[];
}

export const CANONICAL_EVIDENCE_RECORDS: Record<string, LedgerEntityData> = {
  'timor-launch': {
    id: 'timor-launch',
    title: 'Estimated Launch Area',
    time: '08:00 (approx)',
    badge: 'DIGITAL RECONSTRUCTION',
    classification: 'DIGITAL_RECONSTRUCTION',
    confidence: 'MODERATE',
    known: '1st Carrier Air Fleet was operating in the Timor Sea approximately 220 NM NNW of Darwin. Takeoff commenced ~07:50–08:00 (06:20–06:25 JST), with Fuchida airborne at 06:22 JST.',
    uncertain: 'Exact coordinate of the flagship Akagi during launch is a general operational envelope with a ~40km uncertainty radius.',
    notes: 'Reconstructed parameter. Center point is a mathematical camera anchor, not an observed coordinate. Full operational launch/assembly window ran 08:00 to 08:45 Darwin Local Time.',
    sources: [{ title: 'Senshi Sōsho Vol. 26', institution: 'Japanese Official History' }]
  },
  'bathurst-mission': {
    id: 'bathurst-mission',
    title: 'Sacred Heart Mission, Nguiu',
    time: '09:35',
    badge: 'ARCHIVAL RECORD',
    classification: 'CONTEMPORARY_ARCHIVAL_RECORD',
    confidence: 'VERIFIED',
    known: 'The mission was an established location. Father McGrath sighted the formation and transmitted a warning to Darwin VID.',
    uncertain: 'The exact physical position from which he personally observed the formation is not established to survey precision.',
    notes: '09:35 sighting. 09:37 transmission (Darwin Local Time).',
    sources: [
      { title: 'Lowe Commission Exhibit 3', institution: 'Official Inquiry (1942)' },
      { title: 'Father McGrath Radio Log', institution: 'Contemporary Archive' }
    ]
  },
  'first-wave-approach': {
    id: 'first-wave-approach',
    title: 'First-Wave Approach',
    time: '09:58',
    badge: 'DIGITAL RECONSTRUCTION',
    classification: 'DIGITAL_RECONSTRUCTION',
    confidence: 'MODERATE',
    known: '188-aircraft total is strongly supported. The broad approach over the peninsula is evidence-based.',
    uncertain: 'The 71/72 D3A dive bomber discrepancy exists between official histories and some Australian War Memorial sources. Individual aircraft tracks are not known.',
    notes: 'The rendered corridor is an interpretive reconstruction. The project does not show false precision by rendering 188 individual 3D aircraft tracks.',
    sources: [
      { title: 'Senshi Sōsho Vol. 26', institution: 'Japanese Official History' },
      { title: 'Lowe Commission', institution: 'Official Inquiry (1942)' }
    ]
  },
  'post-office': {
    id: 'post-office',
    title: 'Darwin Post & Telegraph Office',
    time: '10:00',
    badge: 'ESTABLISHED FACT',
    classification: 'ESTABLISHED_FACT',
    confidence: 'VERIFIED',
    known: 'The civilian shelter trench behind the Post Office received a direct bomb hit at approximately 10:00.',
    uncertain: 'Casualty discrepancy: AWM records state 9 staff members killed. LANT and some AWM publications state 10 people sheltering were killed.',
    notes: 'Pending formal adjudication to determine if discrepancy arises from staff classification vs. total occupants.',
    sources: [
      { title: 'Lowe Commission', institution: 'Official Inquiry (1942)' },
      { title: 'Civilian Casualties', institution: 'Commonwealth War Graves Commission' }
    ]
  },
  'peary-underway': {
    id: 'peary-underway',
    title: 'USS Peary Under Attack',
    time: '10:45',
    badge: 'ESTABLISHED FACT',
    classification: 'ESTABLISHED_FACT',
    confidence: 'VERIFIED',
    known: 'USS Peary (DD-226) was targeted by sustained dive-bomber attacks while manoeuvring in Darwin Harbour, struck by five bombs between 10:15 and 10:45.',
    uncertain: 'Exact surface track during evasive manoeuvres within the harbour is reconstructed from survivor testimony.',
    notes: 'Five direct bomb hits confirmed by US Navy action reports and official naval histories.',
    sources: [
      { title: 'DANFS: USS Peary', institution: 'US Naval History and Heritage Command' },
      { title: 'Royal Australian Navy Vol. 1', institution: 'Official History' }
    ]
  },
  'raaf-station': {
    id: 'raaf-station',
    title: 'RAAF Station Darwin (Airfield)',
    time: '12:00',
    badge: 'ESTABLISHED FACT',
    classification: 'ESTABLISHED_FACT',
    confidence: 'VERIFIED',
    known: 'Fifty-four land-based heavy bombers arrived at high altitude (18,000–23,000 ft) to pattern-bomb RAAF Station Darwin at Parap between 11:58 and 12:25.',
    uncertain: 'Radar 311 at Dripstone was on site but not yet calibrated or connected to an operational plotting network.',
    notes: 'Second raid of 19 February 1942 comprised 27 G4M1 Bettys and 27 G3M2 Nells.',
    sources: [
      { title: 'Senshi Sōsho Vol. 26', institution: 'Japanese Official History' },
      { title: 'Royal Australian Air Force 1939–1942', institution: 'Official History (Gillison)' },
      { title: 'Lowe Commission', institution: 'Official Inquiry (1942)' }
    ]
  },
  'peary-wreck': {
    id: 'peary-wreck',
    title: 'USS Peary (DD-226)',
    time: '13:00',
    badge: 'ESTABLISHED FACT',
    classification: 'ESTABLISHED_FACT',
    confidence: 'HIGH',
    known: 'Modern surveyed wreck position on the seabed at 27m depth. Documented high-speed evasion in harbour channel prior to sinking.',
    uncertain: 'Unresolved exact surface sinking trajectory. Casualty-source disagreement: authoritative sources report different casualty totals (NHHC: 80, RAN: 88, AWM: 91).',
    notes: 'Legally protected historic shipwreck and war grave under Commonwealth legislation.',
    sources: [
      { title: 'Australian Hydrographic Office (Chart Aus 26)', institution: 'Official Hydrographic Survey' },
      { title: 'DANFS: USS Peary', institution: 'US Naval History and Heritage Command' },
      { title: 'Royal Australian Navy Vol. 1', institution: 'Official History' }
    ]
  },
  'stokes-hill-wharf': {
    id: 'stokes-hill-wharf',
    title: 'Stokes Hill Wharf & MV Neptuna',
    time: '10:12',
    badge: 'ARCHIVAL RECORD',
    classification: 'CONTEMPORARY_ARCHIVAL_RECORD',
    confidence: 'VERIFIED',
    known: 'MV Neptuna was berthed at Stokes Hill Wharf laden with depth charges and ammunition. Struck during the first wave, she caught fire and detonated at 10:12, severing a 100-foot section of the wharf.',
    uncertain: 'Exact 1942 timber wharf footprint remains unresolved (null coordinates applied).',
    notes: 'Stokes Hill Wharf is the principal geographic anchor linking 1942 events to the modern waterfront.',
    sources: [
      { title: 'Lowe Commission Exhibit 3', institution: 'Official Inquiry (1942)' },
      { title: 'NAA Darwin Wharf Plans 1942', institution: 'National Archives of Australia' },
      { title: 'AWM 128108 Photograph', institution: 'Australian War Memorial' }
    ]
  },
  'kelat-wreck': {
    id: 'kelat-wreck',
    title: 'Coal Hulk Kelat (Subsequent Loss)',
    time: '24 February 1942',
    badge: 'HISTORICAL FACT',
    classification: 'ESTABLISHED_FACT',
    confidence: 'HIGH',
    known: 'Iron coal hulk Kelat sustained hull damage from bomb near-misses on 19 February 1942, slowly took on water, and sank five days later on 24 February. Modern surveyed wreck rests at 15m depth.',
    uncertain: 'Exact 19 February anchorage position versus 24 February sinking position.',
    notes: 'Contextual seabed evidence; Kelat is not counted among the eight vessels sunk on the day of 19 February 1942.',
    sources: [
      { title: 'Australian Hydrographic Office (Chart Aus 26)', institution: 'Official Hydrographic Survey' },
      { title: 'Royal Australian Navy 1939–1942 (G. Hermon Gill)', institution: 'Official War History' }
    ]
  }
};

export type EvidenceNodeType = 
  | 'DOCUMENTED_HISTORICAL' 
  | 'MODERN_SURVEYED_WRECK' 
  | 'APPROXIMATE_ACTIVITY' 
  | 'BOMB_IMPACT';

interface EvidenceNodeRecord {
  id: string;
  type: EvidenceNodeType;
  primaryEntities: CesiumType.Entity[];
  labelEntity: CesiumType.Entity;
  relevanceMap: Partial<Record<SpatialDemonstrationStateId, 'PRIMARY' | 'CONTEXTUAL' | 'HIDDEN'>>;
}

export enum TransitionPhase {
  IDLE = 'IDLE',
  FLYING = 'FLYING',
  SETTLED = 'SETTLED'
}

export class SpatialEvidenceOverlay {
  private Cesium: typeof CesiumType;
  private viewer: CesiumType.Viewer;
  private dataSource: CesiumType.CustomDataSource | null = null;
  private evidenceNodes: EvidenceNodeRecord[] = [];
  private activeStateId: SpatialDemonstrationStateId = 'STATE_00_WORLD';
  private phase: TransitionPhase = TransitionPhase.IDLE;
  private formationController: SpatialFormationController | null = null;

  // Dedicated scene-choreography entities
  private communicationLineEntity: CesiumType.Entity | null = null;
  private communicationLabelEntity: CesiumType.Entity | null = null;
  private communicationProgress: number = 0;
  private communicationTimer: any = null;

  constructor(Cesium: typeof CesiumType, viewer: CesiumType.Viewer) {
    this.Cesium = Cesium;
    this.viewer = viewer;
  }

  public async initialize(): Promise<void> {
    const Cesium = this.Cesium;
    this.dataSource = new Cesium.CustomDataSource('darwin-historical-evidence');
    await this.viewer.dataSources.add(this.dataSource);

    this.formationController = new SpatialFormationController(this.Cesium, this.viewer, this.dataSource);
    this.formationController.initialize();

    this.buildEvidenceEntities();
    this.setupInteraction();
    this.updateVisibility();
  }

  private setupInteraction(): void {
    const handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.setInputAction((movement: any) => {
      const pickedObject = this.viewer.scene.pick(movement.position);
      if (this.Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
        const props = pickedObject.id.properties.getValue(this.viewer.clock.currentTime);
        if (props && props.ledgerData) {
          if (typeof window !== 'undefined' && (window as any).openEvidenceLedger) {
            (window as any).openEvidenceLedger(props.ledgerData);
          }
        }
      }
    }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  private buildEvidenceEntities(): void {
    if (!this.dataSource) return;
    const Cesium = this.Cesium;

    const goldColor = Cesium.Color.fromCssColorString('#C6A15B');
    const goldMuted = Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.40)');
    const boneColor = Cesium.Color.fromCssColorString('#ECE7DB');
    const darkBg = Cesium.Color.fromCssColorString('#07090B');
    const corridorOutline = Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.50)');
    const corridorFill = Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.08)');
    const nauticalWreckOutline = Cesium.Color.fromCssColorString('rgba(238, 233, 223, 0.85)');
    const nauticalWreckFill = Cesium.Color.fromCssColorString('rgba(238, 233, 223, 0.06)');

    const labelFont = '300 11px "Museo Sans", -apple-system, BlinkMacSystemFont, sans-serif';
    const monumentalFont = '500 12px "Museo Sans", -apple-system, BlinkMacSystemFont, sans-serif';
    const scaleFont = '500 13px "Museo Sans", -apple-system, BlinkMacSystemFont, sans-serif';

    // =========================================================================
    // BEAT 0 (08:00): TIMOR SEA LAUNCH AREA · REPRESENTATIVE CARRIER GROUP & FORMATION
    // 1st Carrier Air Fleet operating ~220 NM NNW Darwin. Uncertainty ~40km.
    // Carriers: Akagi (Flagship), Kaga, Soryu, Hiryu.
    // Representative aircraft assembly: 188 aircraft scale statement.
    // =========================================================================
    const node0Entities: CesiumType.Entity[] = [];

    // Operational launch envelope (~40km uncertainty circle)
    const launchArea = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(129.0, -10.5, 50),
      ellipse: {
        semiMajorAxis: 45000,
        semiMinorAxis: 38000,
        material: corridorFill,
        outline: true,
        outlineColor: corridorOutline,
        outlineWidth: 1.5,
      },
      show: false,
    });
    node0Entities.push(launchArea);

    // 4 Aircraft Carriers (Akagi, Kaga, Soryu, Hiryu) in reconstructed relative tactical grouping
    const carriers = [
      { name: 'AKAGI', lon: 128.92, lat: -10.46, isFlagship: true },
      { name: 'KAGA', lon: 128.98, lat: -10.54, isFlagship: false },
      { name: 'SORYU', lon: 129.06, lat: -10.48, isFlagship: false },
      { name: 'HIRYU', lon: 129.12, lat: -10.55, isFlagship: false },
    ];

    for (const c of carriers) {
      // 3D physical extruded plinth representing the ship at sea level
      const plinth = this.dataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(c.lon, c.lat, 10),
        box: {
          dimensions: new Cesium.Cartesian3(400, 120, 20),
          material: Cesium.Color.fromCssColorString('rgba(27, 27, 24, 0.85)'),
          outline: true,
          outlineColor: goldColor,
        },
        show: false,
      });
      node0Entities.push(plinth);

      // High-DPI plan silhouette billboard
      const carrierTexture = SpatialRepresentativeAssets.getCarrierTexture({ name: c.name, isFlagship: c.isFlagship });
      if (carrierTexture) {
        const billboard = this.dataSource.entities.add({
          position: Cesium.Cartesian3.fromDegrees(c.lon, c.lat, 35),
          billboard: {
            image: carrierTexture,
            width: 140,
            height: 35,
            alignedAxis: Cesium.Cartesian3.UNIT_Z,
            rotation: Cesium.Math.toRadians(140),
            scaleByDistance: new Cesium.NearFarScalar(5e4, 1.2, 3e6, 0.7),
          },
          show: false,
        });
        node0Entities.push(billboard);
      }

      // Individual carrier designation label
      const nameLabel = this.dataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(c.lon, c.lat, 80),
        label: {
          text: c.name + (c.isFlagship ? ' (FLAGSHIP)' : ''),
          font: '500 10px "Museo Sans", sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: boneColor,
          outlineColor: darkBg,
          outlineWidth: 3,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          scaleByDistance: new Cesium.NearFarScalar(1e5, 1.0, 3e6, 0.6),
        },
        show: false,
      });
      node0Entities.push(nameLabel);
    }

    // Representative aircraft assembly flights (managed dynamically by SpatialFormationController
    // with configurable density levels: 12, 24, or 36 aircraft stepped across 3 altitude bands)

    // Transit corridor vector heading southeast toward Bathurst Island
    const launchCorridor = this.dataSource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          129.0, -10.5, 4000,
          130.627, -11.758, 3500,
        ]),
        width: 1.5,
        material: new Cesium.PolylineDashMaterialProperty({
          color: corridorOutline,
          dashLength: 16.0,
        }),
      },
      show: false,
    });
    node0Entities.push(launchCorridor);

    // Primary scale & authority label for Beat 0
    const launchLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['timor-launch'] }),
      position: Cesium.Cartesian3.fromDegrees(129.25, -10.75, 4200),
      label: {
        text: 'FIRST WAVE STRIKE FORCE: 188 AIRCRAFT · 08:00\n81 LEVEL BOMBERS · 71 DIVE BOMBERS · 36 FIGHTERS\nESTIMATED LAUNCH AREA · LAUNCH & FLEET ASSEMBLY ~220 NM NNW DARWIN',
        font: scaleFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -16),
        scaleByDistance: new Cesium.NearFarScalar(1e5, 1.0, 4e6, 0.7),
      },
      show: false,
    });

    this.evidenceNodes.push({
      id: 'NODE_TIMOR_LAUNCH',
      type: 'APPROXIMATE_ACTIVITY',
      primaryEntities: node0Entities,
      labelEntity: launchLabel,
      relevanceMap: {
        BEAT_0_TIMOR_LAUNCH: 'PRIMARY',
        STATE_01_NORTH: 'CONTEXTUAL',
      },
    });

    // =========================================================================
    // BEAT 1 (09:35): BATHURST ISLAND WARNING · NGUIU SITE MONUMENT & SCHEMATIC EVENT
    // Sacred Heart Mission at Nguiu. Father McGrath transmits warning 09:37.
    // Prominent authored labels: BATHURST ISLAND and DARWIN.
    // Continuous schematic communication line (no dotted line, no radar sweep).
    // =========================================================================
    const node1Entities: CesiumType.Entity[] = [];

    // Prominent Project-Authored Geography Labels
    const bathurstIslandLabel = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.40, -11.60, 2500),
      label: {
        text: 'BATHURST ISLAND',
        font: '500 14px "Museo Sans", sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 4,
        scaleByDistance: new Cesium.NearFarScalar(3e4, 1.1, 8e5, 0.7),
      },
      show: false,
    });
    node1Entities.push(bathurstIslandLabel);

    const darwinContextLabel = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.84, -12.44, 1500),
      label: {
        text: 'DARWIN (MAINLAND)',
        font: '500 13px "Museo Sans", sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: goldColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        scaleByDistance: new Cesium.NearFarScalar(3e4, 1.0, 8e5, 0.7),
      },
      show: false,
    });
    node1Entities.push(darwinContextLabel);

    // Sacred Heart Mission Architectural Site Monument (vertical presence)
    const missionPlinth = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['bathurst-mission'] }),
      position: Cesium.Cartesian3.fromDegrees(130.627, -11.758, 200),
      cylinder: {
        length: 400,
        topRadius: 180,
        bottomRadius: 220,
        material: Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.25)'),
        outline: true,
        outlineColor: goldColor,
        outlineWidth: 1.5,
      },
      show: false,
    });
    node1Entities.push(missionPlinth);

    // Base survey disc
    const missionDisc = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.627, -11.758, 20),
      ellipse: {
        semiMajorAxis: 1200,
        semiMinorAxis: 1200,
        material: Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.10)'),
        outline: true,
        outlineColor: goldMuted,
        outlineWidth: 1.0,
      },
      show: false,
    });
    node1Entities.push(missionDisc);

    // Observed transit corridor across Clarence Strait heading ~140°
    const bathurstCorridor = this.dataSource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          130.627, -11.758, 3500,
          131.05, -12.30, 3200,
        ]),
        width: 2.0,
        material: corridorOutline,
      },
      show: false,
    });
    node1Entities.push(bathurstCorridor);

    // Dynamic 09:37 Communication Line across Clarence Strait (continuous archival line)
    this.communicationLineEntity = this.dataSource.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          const t = this.communicationProgress;
          const startLon = 130.627, startLat = -11.758, startAlt = 400;
          const endLon = 130.8443, endLat = -12.4647, endAlt = 100;
          const curLon = startLon + (endLon - startLon) * t;
          const curLat = startLat + (endLat - startLat) * t;
          const curAlt = startAlt + (endAlt - startAlt) * t;
          return Cesium.Cartesian3.fromDegreesArrayHeights([
            startLon, startLat, startAlt,
            curLon, curLat, curAlt,
          ]);
        }, false),
        width: 2.5,
        material: goldColor,
      },
      show: false,
    });
    node1Entities.push(this.communicationLineEntity);

    // 09:37 Warning transmission endpoint annotation
    this.communicationLabelEntity = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.8443, -12.4647, 150),
      label: {
        text: '09:37 · WARNING TRANSMITTED VIA COASTAL RADIO SERVICE (VID)\n"LARGE FORMATION UNIDENTIFIED AIRCRAFT OVERHEAD HEADING SOUTH"',
        font: monumentalFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -16),
      },
      show: false,
    });
    node1Entities.push(this.communicationLabelEntity);

    // Primary mission label
    const bathurstLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['bathurst-mission'] }),
      position: Cesium.Cartesian3.fromDegrees(130.627, -11.758, 450),
      label: {
        text: 'SACRED HEART MISSION, NGUIU · 09:35\nFATHER JOHN MCGRATH OBSERVER SITE · SIGHTING RECORDED\n[ARCHIVAL GROUND SITE MONUMENT]',
        font: monumentalFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -16),
        scaleByDistance: new Cesium.NearFarScalar(3e4, 1.0, 8e5, 0.7),
      },
      show: false,
    });

    this.evidenceNodes.push({
      id: 'NODE_BATHURST_MISSION',
      type: 'DOCUMENTED_HISTORICAL',
      primaryEntities: node1Entities,
      labelEntity: bathurstLabel,
      relevanceMap: {
        BEAT_1_BATHURST_WARNING: 'PRIMARY',
        BEAT_0_TIMOR_LAUNCH: 'CONTEXTUAL',
        STATE_01_NORTH: 'CONTEXTUAL',
      },
    });

    // =========================================================================
    // BEAT 2 (09:58): DARWIN HARBOUR & TOWN STRIKE · BROAD RECONSTRUCTED APPROACH FIELD
    // Broad tapered directional envelope (fan) out of rising sun (315°–345° axis).
    // Documented shipping roadstead impact sector and civic peninsula sector.
    // =========================================================================
    const node2Entities: CesiumType.Entity[] = [];

    // Broad Reconstructed Approach Envelope (polygon fan coming from southeast)
    const approachFan = this.dataSource.entities.add({
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
          130.8456, -12.4634, 1200, // Apex at Darwin Harbour roadstead
          131.02, -12.62, 3200,    // Southern flank
          131.08, -12.54, 3200,    // Eastern flank
        ]),
        material: corridorFill,
        outline: true,
        outlineColor: corridorOutline,
        outlineWidth: 1.5,
      },
      show: false,
    });
    node2Entities.push(approachFan);

    // Harbour Roadstead Impact Sector (bounded polygon)
    const harbourRoadstead = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.8420, -12.4700, 15),
      ellipse: {
        semiMajorAxis: 1800,
        semiMinorAxis: 1100,
        material: Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.10)'),
        outline: true,
        outlineColor: goldMuted,
        outlineWidth: 1.2,
      },
      show: false,
    });
    node2Entities.push(harbourRoadstead);

    // Primary Harbour & Town Strike Label
    const harbourLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['first-wave-approach'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8456, -12.4634, 400),
      label: {
        text: 'DARWIN HARBOUR & TOWN PENINSULA · 09:58\nFIRST BOMBS IMPACT ROADSTEAD & CIVIC PRECINCT\nRECONSTRUCTED APPROACH AXIS (315°–345°) OUT OF RISING SUN · 188 AIRCRAFT',
        font: monumentalFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
        scaleByDistance: new Cesium.NearFarScalar(1e4, 1.0, 3e5, 0.7),
      },
      show: false,
    });

    this.evidenceNodes.push({
      id: 'NODE_HARBOUR_STRIKE',
      type: 'BOMB_IMPACT',
      primaryEntities: node2Entities,
      labelEntity: harbourLabel,
      relevanceMap: {
        BEAT_2_HARBOUR_STRIKE: 'PRIMARY',
        STATE_02_DARWIN: 'CONTEXTUAL',
        BEAT_3_POST_OFFICE: 'CONTEXTUAL',
        BEAT_4_PEARY_ATTACK: 'CONTEXTUAL',
      },
    });

    // =========================================================================
    // BEAT 3 (10:00): DARWIN POST OFFICE TRENCH DIRECT HIT · ABSTRACT ARCHIVAL SITE MONUMENT
    // Corner Mitchell & Bennett Streets. Extruded 3D gold architectural plinth (32m x 20m x 35m).
    // Verified civic shelter trench fatality site (9 killed).
    // =========================================================================
    const node3Entities: CesiumType.Entity[] = [];

    // Abstract 3D Extruded Architectural Plinth (Mitchell & Bennett Sts)
    const poPlinth = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['post-office'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8443, -12.4647, 18),
      box: {
        dimensions: new Cesium.Cartesian3(32, 22, 36),
        material: Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.30)'),
        outline: true,
        outlineColor: goldColor,
      },
      show: false,
    });
    node3Entities.push(poPlinth);

    // Architectural ground survey perimeter ring
    const poSurveyRing = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.8443, -12.4647, 5),
      ellipse: {
        semiMajorAxis: 50,
        semiMinorAxis: 40,
        material: Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.12)'),
        outline: true,
        outlineColor: goldColor,
        outlineWidth: 1.5,
      },
      show: false,
    });
    node3Entities.push(poSurveyRing);

    // Vertical archival beacon line
    const poBeacon = this.dataSource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          130.8443, -12.4647, 0,
          130.8443, -12.4647, 60,
        ]),
        width: 2.0,
        material: goldColor,
      },
      show: false,
    });
    node3Entities.push(poBeacon);

    const postOfficeLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['post-office'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8443, -12.4647, 65),
      label: {
        text: 'DARWIN POST & TELEGRAPH OFFICE · 10:00\nTHE SHELTER TRENCH RECEIVED A DIRECT HIT\n[ABSTRACT ARCHIVAL SITE MONUMENT · MITCHELL & BENNETT STS]',
        font: monumentalFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
      },
      show: false,
    });

    this.evidenceNodes.push({
      id: 'NODE_POST_OFFICE',
      type: 'BOMB_IMPACT',
      primaryEntities: node3Entities,
      labelEntity: postOfficeLabel,
      relevanceMap: {
        BEAT_3_POST_OFFICE: 'PRIMARY',
        BEAT_2_HARBOUR_STRIKE: 'CONTEXTUAL',
        BEAT_7_RECKONING: 'CONTEXTUAL',
      },
    });

    // =========================================================================
    // BEAT 4 (10:45): USS PEARY UNDER ATTACK · REPRESENTATIVE SHIP & MANOEUVRE SECTOR
    // Representative Clemson-class destroyer silhouette underway evading in channel.
    // Approximate harbour channel manoeuvre sector. Contextual leader to surveyed wreck site.
    // =========================================================================
    const node4Entities: CesiumType.Entity[] = [];

    // Approximate Harbour Channel Manoeuvre Sector
    const pearyArea = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.832, -12.473, 5),
      ellipse: {
        semiMajorAxis: 1600,
        semiMinorAxis: 800,
        material: corridorFill,
        outline: true,
        outlineColor: corridorOutline,
        outlineWidth: 1.5,
      },
      show: false,
    });
    node4Entities.push(pearyArea);

    // Representative Destroyer (USS Peary) plan silhouette
    const destroyerTexture = SpatialRepresentativeAssets.getDestroyerTexture();
    if (destroyerTexture) {
      const pearyShip = this.dataSource.entities.add({
        properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['peary-underway'] }),
        position: Cesium.Cartesian3.fromDegrees(130.832, -12.473, 15),
        billboard: {
          image: destroyerTexture,
          width: 140,
          height: 35,
          alignedAxis: Cesium.Cartesian3.UNIT_Z,
          rotation: Cesium.Math.toRadians(35), // heading up-channel
          scaleByDistance: new Cesium.NearFarScalar(2e3, 1.2, 5e4, 0.7),
        },
        show: false,
      });
      node4Entities.push(pearyShip);
    }

    // Extruded hull plinth at sea level
    const pearyHullPlinth = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.832, -12.473, 5),
      box: {
        dimensions: new Cesium.Cartesian3(95, 20, 10),
        material: Cesium.Color.fromCssColorString('rgba(29, 30, 32, 0.8)'),
        outline: true,
        outlineColor: goldColor,
      },
      show: false,
    });
    node4Entities.push(pearyHullPlinth);

    // Contextual dashed leader line to Modern Surveyed Wreck Site (~700m SW)
    const wreckLeaderLine = this.dataSource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          130.832, -12.473, 20,
          130.8292, -12.4754, 5,
        ]),
        width: 1.5,
        material: new Cesium.PolylineDashMaterialProperty({
          color: goldMuted,
          dashLength: 8.0,
        }),
      },
      show: false,
    });
    node4Entities.push(wreckLeaderLine);

    const pearyLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['peary-underway'] }),
      position: Cesium.Cartesian3.fromDegrees(130.832, -12.473, 50),
      label: {
        text: 'USS PEARY (DD-226) · 10:15–10:45\nREPRESENTATIVE DESTROYER · ACTIVE COMBAT MANOEUVRE SECTOR\nUNDERWAY HIGH-SPEED EVASION · 5 DIRECT BOMB HITS',
        font: monumentalFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
      },
      show: false,
    });

    this.evidenceNodes.push({
      id: 'NODE_PEARY_COMBAT_SECTOR',
      type: 'APPROXIMATE_ACTIVITY',
      primaryEntities: node4Entities,
      labelEntity: pearyLabel,
      relevanceMap: {
        BEAT_4_PEARY_ATTACK: 'PRIMARY',
        BEAT_6_PEARY_LOST: 'CONTEXTUAL',
        BEAT_2_HARBOUR_STRIKE: 'CONTEXTUAL',
      },
    });

    // =========================================================================
    // BEAT 5 (12:00): RAAF STATION DARWIN · HIGH-ALTITUDE BOMBER FORMATION
    // 54 land-based heavy bombers (G4M1 Bettys & G3M2 Nells) from Kendari & Ambon.
    // 18,000–23,000 ft (6,500m) altitude. Stepped V-echelon formation flights.
    // Ground airfield perimeter outlined at Parap below.
    // =========================================================================
    const node5Entities: CesiumType.Entity[] = [];

    // High-Altitude Twin-Engine Bomber Formation (managed dynamically by SpatialFormationController
    // with stepped V-echelon elements at 6,500m / ~21,300 ft ceiling)

    // Airfield perimeter at ground level (RAAF Station Darwin at Parap)
    const raafPerimeter = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['raaf-station'] }),
      position: Cesium.Cartesian3.fromDegrees(130.875, -12.414, 30),
      ellipse: {
        semiMajorAxis: 2400,
        semiMinorAxis: 1600,
        material: Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.10)'),
        outline: true,
        outlineColor: goldColor,
        outlineWidth: 1.5,
      },
      show: false,
    });
    node5Entities.push(raafPerimeter);

    // Ingress vector from Beagle Gulf
    const secondWaveCorridor = this.dataSource.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          130.65, -12.20, 6500,
          130.875, -12.414, 6500,
        ]),
        width: 2.0,
        material: corridorOutline,
      },
      show: false,
    });
    node5Entities.push(secondWaveCorridor);

    // Primary formation & target label
    const raafLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['raaf-station'] }),
      position: Cesium.Cartesian3.fromDegrees(130.83, -12.33, 6800),
      label: {
        text: 'SECOND WAVE: 54 LAND-BASED BOMBERS (G4M1 & G3M2) · 12:00\nHIGH-ALTITUDE PATTERN BOMBING · 18,000–23,000 FT (6,500M)\n[TARGET: RAAF STATION DARWIN / PARAP AERODROME BELOW]',
        font: scaleFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -16),
        scaleByDistance: new Cesium.NearFarScalar(1e4, 1.0, 4e5, 0.7),
      },
      show: false,
    });

    this.evidenceNodes.push({
      id: 'NODE_RAAF_AIRFIELD',
      type: 'DOCUMENTED_HISTORICAL',
      primaryEntities: node5Entities,
      labelEntity: raafLabel,
      relevanceMap: {
        BEAT_5_RAAF_AIRFIELD: 'PRIMARY',
        STATE_02_DARWIN: 'CONTEXTUAL',
        BEAT_2_HARBOUR_STRIKE: 'CONTEXTUAL',
      },
    });

    // =========================================================================
    // BEAT 6 (13:00): USS PEARY IS LOST · MODERN SURVEYED WRECK POSITION
    // Modern surveyed wreck position at 27m seabed depth (Chart Aus 26).
    // Hydrographic wreck symbol billboard (Chart Aus 26 standard) + DEPTH 27M annotation.
    // Vertical sounding line removed to avoid visually implying literal bathymetry.
    // =========================================================================
    const node6Entities: CesiumType.Entity[] = [];

    // Nautical hydrographic chart wreck symbol billboard (Chart Aus 26 standard)
    const wreckSymbolTexture = SpatialRepresentativeAssets.getWreckSymbolTexture(27);
    if (wreckSymbolTexture) {
      const wreckSymbol = this.dataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(130.8292, -12.4754, 5),
        billboard: {
          image: wreckSymbolTexture,
          width: 48,
          height: 48,
          scaleByDistance: new Cesium.NearFarScalar(1e3, 1.2, 3e4, 0.7),
        },
        show: false,
      });
      node6Entities.push(wreckSymbol);
    }

    const pearyWreckLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['peary-wreck'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8292, -12.4754, 30),
      label: {
        text: 'USS PEARY (DD-226) · MODERN SURVEYED WRECK POSITION\nDEPTH 27M · PROTECTED HISTORIC SHIPWRECK (CHART AUS 26)',
        font: monumentalFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -14),
      },
      show: false,
    });

    this.evidenceNodes.push({
      id: 'NODE_PEARY_WRECK',
      type: 'MODERN_SURVEYED_WRECK',
      primaryEntities: node6Entities,
      labelEntity: pearyWreckLabel,
      relevanceMap: {
        BEAT_6_PEARY_LOST: 'PRIMARY',
        BEAT_4_PEARY_ATTACK: 'CONTEXTUAL',
        BEAT_7_RECKONING: 'CONTEXTUAL',
      },
    });

    // =========================================================================
    // BEAT 7 (DUSK): THE RECKONING · HARBOUR-WIDE CONSEQUENCE SYNTHESIS
    // Shows the 8 vessels sunk on 19 February 1942 strictly according to canonical evidence:
    // - 5 Modern surveyed seabed wrecks sunk 19 Feb:
    //     USS Peary (27m in Node 6), MV Zealandia (19m), USAT Meigs (18m),
    //     USAT Mauna Loa (18m), British Motorist (20m)
    // - MV Neptuna: Exploded alongside wharf 19 Feb (10:12)
    // - Luggers HMAS Mavie & Highland Warrior: Sunk in harbour waters 19 Feb
    //
    // Separate contextual subsequent loss (Damaged 19 Feb, sank 24 Feb):
    // - Coal Hulk Kelat: Modern surveyed wreck at 15m depth
    // - Stokes Hill Wharf contemporary anchor: "Same wharf. Same sky."
    // =========================================================================
    const node7Entities: CesiumType.Entity[] = [];

    // Modern Surveyed Seabed Wreck Markers across Darwin Harbour: Sunk on 19 February 1942
    const sunkFeb19SurveyedWrecks = [
      { name: 'MV ZEALANDIA', lon: 130.8421, lat: -12.4648, depth: 19 },
      { name: 'USAT MEIGS', lon: 130.8425, lat: -12.4861, depth: 18 },
      { name: 'USAT MAUNA LOA', lon: 130.8354, lat: -12.4822, depth: 18 },
      { name: 'BRITISH MOTORIST', lon: 130.8431, lat: -12.4742, depth: 20 },
    ];

    for (const w of sunkFeb19SurveyedWrecks) {
      const wreckTex = SpatialRepresentativeAssets.getWreckSymbolTexture(w.depth);
      if (wreckTex) {
        const symbol = this.dataSource.entities.add({
          position: Cesium.Cartesian3.fromDegrees(w.lon, w.lat, 5),
          billboard: {
            image: wreckTex,
            width: 36,
            height: 36,
            scaleByDistance: new Cesium.NearFarScalar(1e3, 1.1, 5e4, 0.7),
          },
          show: false,
        });
        node7Entities.push(symbol);
      }

      const label = this.dataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(w.lon, w.lat, 25),
        label: {
          text: `SUNK 19 FEB · ${w.name} · ${w.depth}M`,
          font: labelFont,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: boneColor,
          outlineColor: darkBg,
          outlineWidth: 3,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          scaleByDistance: new Cesium.NearFarScalar(2e3, 1.0, 4e4, 0.7),
        },
        show: false,
      });
      node7Entities.push(label);
    }

    // Contextual Subsequent Loss: Coal Hulk Kelat (Damaged 19 Feb, Sank 24 Feb)
    // Explicitly distinguished from the canonical eight vessels sunk on 19 Feb
    const kelatWreckTex = SpatialRepresentativeAssets.getWreckSymbolTexture(15);
    if (kelatWreckTex) {
      const kelatSymbol = this.dataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(130.8450, -12.4770, 5),
        billboard: {
          image: kelatWreckTex,
          width: 32,
          height: 32,
          color: Cesium.Color.fromCssColorString('#8E959E'), // Muted secondary tone
          scaleByDistance: new Cesium.NearFarScalar(1e3, 0.95, 5e4, 0.6),
        },
        show: false,
      });
      node7Entities.push(kelatSymbol);
    }

    const kelatLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({
        classification: 'CONTEXTUAL_SUBSEQUENT_LOSS',
        lossDate: '1942-02-24',
        damageDate: '1942-02-19',
        ledgerData: CANONICAL_EVIDENCE_RECORDS['kelat-wreck'],
      }),
      position: Cesium.Cartesian3.fromDegrees(130.8450, -12.4770, 25),
      label: {
        text: 'KELAT · 15M\nDAMAGED 19 FEB · SANK 24 FEB',
        font: labelFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: Cesium.Color.fromCssColorString('#A2A8B0'), // Visually distinct muted steel tone
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -10),
        scaleByDistance: new Cesium.NearFarScalar(2e3, 0.9, 4e4, 0.6),
      },
      show: false,
    });
    node7Entities.push(kelatLabel);

    // MV Neptuna explosion & wharf breach note (Unresolved 1942 timber berth coordinates respected)
    const neptunaMarker = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['stokes-hill-wharf'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8490, -12.4735, 10),
      label: {
        text: 'MV NEPTUNA · EXPLODED ALONGSIDE WHARF · 10:12\n100 FT OF WHARF SEVERED',
        font: labelFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: goldColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -12),
      },
      show: false,
    });
    node7Entities.push(neptunaMarker);

    // Contemporary Stokes Hill Wharf Anchor Site
    const wharfPoint = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['stokes-hill-wharf'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8485, -12.4725, 10),
      point: {
        pixelSize: 8,
        color: goldColor,
        outlineColor: darkBg,
        outlineWidth: 2,
      },
      show: false,
    });
    node7Entities.push(wharfPoint);

    const wharfRing = this.dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(130.8485, -12.4725, 10),
      ellipse: {
        semiMajorAxis: 100,
        semiMinorAxis: 100,
        material: Cesium.Color.fromCssColorString('rgba(198, 161, 91, 0.15)'),
        outline: true,
        outlineColor: goldColor,
        outlineWidth: 1.5,
      },
      show: false,
    });
    node7Entities.push(wharfRing);

    // Archival Consequence Synthesis Board in world space
    const wharfLabel = this.dataSource.entities.add({
      properties: new Cesium.PropertyBag({ ledgerData: CANONICAL_EVIDENCE_RECORDS['stokes-hill-wharf'] }),
      position: Cesium.Cartesian3.fromDegrees(130.8485, -12.4725, 50),
      label: {
        text: 'THE RECKONING · DUSK 19 FEBRUARY 1942\nEIGHT SHIPS SUNK IN HARBOUR · OVER 30 AIRCRAFT DESTROYED\n235 TO 250+ FATALITIES · LOWE COMMISSION ADJUDICATED: 243\nPRESENT-DAY STOKES HILL WHARF · SAME WHARF PRECINCT. SAME SKY.',
        font: monumentalFont,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: boneColor,
        outlineColor: darkBg,
        outlineWidth: 3,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -16),
      },
      show: false,
    });

    this.evidenceNodes.push({
      id: 'NODE_STOKES_HILL_WHARF',
      type: 'DOCUMENTED_HISTORICAL',
      primaryEntities: node7Entities,
      labelEntity: wharfLabel,
      relevanceMap: {
        BEAT_7_RECKONING: 'PRIMARY',
        STATE_03_WHARF: 'PRIMARY',
        BEAT_2_HARBOUR_STRIKE: 'CONTEXTUAL',
        BEAT_3_POST_OFFICE: 'CONTEXTUAL',
        BEAT_4_PEARY_ATTACK: 'CONTEXTUAL',
        BEAT_6_PEARY_LOST: 'CONTEXTUAL',
      },
    });
  }

  /**
   * Called immediately when camera flight begins:
   * 1. Hides all labels across all nodes immediately (eliminates text flashing / label dragging).
   * 2. Sets phase to FLYING.
   */
  public prepareTransition(targetStateId: SpatialDemonstrationStateId): void {
    this.phase = TransitionPhase.FLYING;
    this.formationController?.prepareTransition(targetStateId);

    if (this.communicationTimer) {
      clearInterval(this.communicationTimer);
      this.communicationTimer = null;
    }
    this.communicationProgress = 0;
    if (this.communicationLineEntity) this.communicationLineEntity.show = false;
    if (this.communicationLabelEntity) this.communicationLabelEntity.show = false;

    // Immediately hide all labels so none drag or pop during travel
    for (const node of this.evidenceNodes) {
      node.labelEntity.show = false;
      // Also hide primary entities of incoming scene until camera settles
      const relevance = node.relevanceMap[targetStateId] || 'HIDDEN';
      if (relevance !== 'CONTEXTUAL') {
        for (const ent of node.primaryEntities) {
          ent.show = false;
        }
      }
    }
    this.viewer.scene.requestRender();
  }

  /**
   * Called when camera arrives and settles at authored composition:
   * 1. Sets phase to SETTLED.
   * 2. Reveals primary entities, primary labels, and contextual entities.
   * 3. Triggers beat-specific arrival events (e.g. 09:37 schematic communication line).
   */
  public completeTransition(stateId: SpatialDemonstrationStateId): void {
    this.activeStateId = stateId;
    this.phase = TransitionPhase.SETTLED;
    this.updateVisibility();
    this.formationController?.completeTransition(stateId);

    // Trigger one-time schematic communication event for Beat 1
    if (stateId === 'BEAT_1_BATHURST_WARNING') {
      this.runBathurstCommunicationEvent();
    }

    this.viewer.scene.requestRender();
  }

  /**
   * Cancel in-flight transitions on rapid scroll retargeting
   */
  public cancelTransition(): void {
    this.formationController?.cancelTransition();
    if (this.communicationTimer) {
      clearInterval(this.communicationTimer);
      this.communicationTimer = null;
    }
    this.communicationProgress = 0;
    if (this.communicationLineEntity) this.communicationLineEntity.show = false;
    if (this.communicationLabelEntity) this.communicationLabelEntity.show = false;
    for (const node of this.evidenceNodes) {
      node.labelEntity.show = false;
    }
    this.phase = TransitionPhase.IDLE;
  }

  public setActiveState(stateId: SpatialDemonstrationStateId): void {
    this.prepareTransition(stateId);
    this.completeTransition(stateId);
  }

  private runBathurstCommunicationEvent(): void {
    if (this.communicationTimer) {
      clearInterval(this.communicationTimer);
      this.communicationTimer = null;
    }

    this.communicationProgress = 0;
    if (this.communicationLineEntity) this.communicationLineEntity.show = true;
    if (this.communicationLabelEntity) this.communicationLabelEntity.show = false;

    const startTime = Date.now();
    const duration = 1200; // 1.2s smooth draw across Clarence Strait

    this.communicationTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      this.communicationProgress = progress;
      this.viewer.scene.requestRender();

      if (progress >= 1.0) {
        clearInterval(this.communicationTimer);
        this.communicationTimer = null;
        if (this.communicationLabelEntity) {
          this.communicationLabelEntity.show = true;
        }
        this.viewer.scene.requestRender();
      }
    }, 25);
  }

  /**
   * Beat-Exclusive Evidence Hierarchy when SETTLED:
   * - PRIMARY active subject: 100% full opacity, full archival label shown.
   * - CONTEXTUAL related nodes: subtle opacity, point/ring only (no label clash).
   * - UNRELATED nodes: 0% opacity (completely hidden).
   */
  private updateVisibility(): void {
    for (const node of this.evidenceNodes) {
      const relevance = node.relevanceMap[this.activeStateId] || 'HIDDEN';

      if (relevance === 'PRIMARY') {
        for (const ent of node.primaryEntities) {
          // Keep communication entities controlled by communication event
          if (ent === this.communicationLineEntity || ent === this.communicationLabelEntity) {
            continue;
          }
          ent.show = true;
        }
        node.labelEntity.show = true;
      } else if (relevance === 'CONTEXTUAL') {
        for (const ent of node.primaryEntities) {
          if (ent === this.communicationLineEntity || ent === this.communicationLabelEntity) {
            continue;
          }
          ent.show = true;
        }
        // Suppress secondary labels to avoid visual clutter
        node.labelEntity.show = false;
      } else {
        for (const ent of node.primaryEntities) {
          ent.show = false;
        }
        node.labelEntity.show = false;
      }
    }
  }

  public getFormationController(): SpatialFormationController | null {
    return this.formationController;
  }

  public destroy(): void {
    this.formationController?.destroy();
    this.formationController = null;
    if (this.communicationTimer) {
      clearInterval(this.communicationTimer);
      this.communicationTimer = null;
    }
    if (this.dataSource && this.viewer && !this.viewer.isDestroyed()) {
      this.viewer.dataSources.remove(this.dataSource, true);
      this.dataSource = null;
    }
    this.evidenceNodes = [];
  }
}

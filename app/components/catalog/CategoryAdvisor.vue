<script setup lang="ts">
import type { ProductCategory } from '~~/shared/types';
import { useLocale } from '~~/app/composables/useLocale';
import {
  HelpCircle,
  ChevronDown,
  Layers,
  Ruler,
  Droplets,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-vue-next';

const props = defineProps<{
  category: ProductCategory;
}>();

const { t } = useLocale();
const isOpen = ref(true);

interface AdviceTip {
  title: string;
  subtitle: string;
  desc: string;
  icon: any;
}

const adviceList = computed<AdviceTip[]>(() => {
  switch (props.category) {
    case 'vrijstaande-baden':
      return [
        {
          title: 'Solid Surface vs. Acryl',
          subtitle: 'Materiaalkeuze & Beoogde Sfeer',
          desc: 'Solid Surface is 100% massief gegoten mineraalsteen met een fluweelzachte matte touch die warmte uitzonderlijk lang vasthoudt. Sanitair acryl is lichter van gewicht, snel op lichaamstemperatuur en verkrijgbaar in hoogglans of mat.',
          icon: Layers,
        },
        {
          title: 'Maatvoering & Vrije Ruimte',
          subtitle: '170 cm Compact vs. 180 cm Comfort',
          desc: 'Voor een sculpturaal vrijstaand effect raden we minimaal 10 tot 15 cm vrije ruimte rondom het bad aan. Voor compacte badkamers is 170 cm ideaal; voor royaal ligcomfort kiest u 180 cm.',
          icon: Ruler,
        },
        {
          title: 'Kraancombinatie',
          subtitle: 'Vloerkraan vs. Inbouwmengkraan',
          desc: 'Een vrijstaande vloerkraan (PVD Gunmetal of Mat Zwart) completeert het statement. Plaatst u het bad dicht bij de wand? Dan zorgt een inbouwkraan voor een ultrastrak en minimalistisch lijnenspel.',
          icon: Droplets,
        },
      ];

    case 'inloopdouches':
    case 'douchecabines':
      return [
        {
          title: 'NANO Anti-Kalk Veiligheidsglas',
          subtitle: 'Moeiteloos Schoonmaken',
          desc: 'Onze douchewanden zijn standaard voorzien van 8mm of 10mm gehard veiligheidsglas met een permanente nanocoating. Water en zeepresten glijden soepel af, waardoor kalkaanslag tot 90% wordt verminderd.',
          icon: Sparkles,
        },
        {
          title: 'Profielkleur Harmonie',
          subtitle: 'Kranen & Glasprofielen Afstemmen',
          desc: 'Kies profielen in Chroom, Mat Zwart of Brushed Gunmetal die naadloos aansluiten op uw kranen en accessoires voor een rustgevend esthetisch totaalbeeld.',
          icon: ShieldCheck,
        },
        {
          title: 'Stabilisatiestang & Inloopbreedte',
          subtitle: 'Optimale Toegankelijkheid',
          desc: 'Houd rekening met een comfortabele inloopopening van minimaal 50 tot 60 cm. De meegeleverde stabilisatiestang is eenvoudig in te korten voor zowel wand- als plafondbevestiging.',
          icon: Ruler,
        },
      ];

    case 'badkamermeubels':
    case 'waskommen':
      return [
        {
          title: 'Vochtbestendig & Soft-Close',
          subtitle: 'Duurzaam Dagelijks Gebruik',
          desc: 'Al onze badkamermeubels zijn vervaardigd uit vochtwerend plaatmateriaal met hoogwaardige soft-close ladegeleiders die getest zijn op meer dan 50.000 soepele sluitbewegingen.',
          icon: ShieldCheck,
        },
        {
          title: 'Opzetkom vs. Vlakke Wastafel',
          subtitle: 'Design vs. Schoonmaakgemak',
          desc: 'Een vrijstaande opzetkom van Solid Surface of keramiek geeft een luxueus boutique hotelgevoel. Geïntegreerde wastafels bieden maximale naadloze hygiëne.',
          icon: Layers,
        },
        {
          title: 'Breedte & Indeling',
          subtitle: 'Van 80 cm tot 160 cm Dubbel Meubel',
          desc: 'Voor gezinsbadkamers adviseren we een 120 cm of 160 cm meubel met dubbele waskom en vier royale lades voor een opgeruimde rustgevende sfeer.',
          icon: Ruler,
        },
      ];

    case 'kranen':
      return [
        {
          title: 'PVD Armor Coating',
          subtitle: 'Krasvast & Kleurecht',
          desc: 'Dankzij Physical Vapor Deposition is de toplaag van onze kranen op moleculair niveau verbonden met de messing kern. Dit voorkomt verkleuring en krassen door dagelijks reinigen.',
          icon: Sparkles,
        },
        {
          title: 'Keramische Schijven',
          subtitle: 'Soepele & Nauwkeurige Menging',
          desc: 'Hoogwaardige keramische kardoezen zorgen voor een uiterst nauwkeurige dosering van watertemperatuur en -kracht, zonder hinderlijk nadruppelen.',
          icon: Droplets,
        },
        {
          title: 'Waterbesparende Neoperl Perlator',
          subtitle: 'Comfortabel Zonder Verspilling',
          desc: 'Onze kranen mengen lucht door de waterstraal voor een volle, zachte straal terwijl u tot wel 30% water bespaart.',
          icon: CheckCircle2,
        },
      ];

    case 'vloertegels':
    case 'wandtegels':
      return [
        {
          title: 'Gerectificeerde Keramiek',
          subtitle: 'Superstrakke Minimale Voegen',
          desc: 'Gerectificeerde tegels zijn na het bakproces kaarsrecht gezaagd met exact 90-graden hoeken. Dit maakt ultradunne voegen van slechts 1,5 à 2 mm mogelijk.',
          icon: Layers,
        },
        {
          title: 'Vloerverwarming Geschikt',
          subtitle: 'Optimale Warmtegeleiding',
          desc: 'Keramisch porcellanato geleidt warmte uitstekend en slaat deze langdurig op, ideaal in combinatie met vloerverwarming in de badkamer.',
          icon: Sparkles,
        },
        {
          title: 'Snijverlies Advies',
          subtitle: '+10% Standaard of +15% Visgraat',
          desc: 'Houd altijd rekening met zaag- en snijverlies bij het betegelen. Gebruik onze interactieve tegelcalculator op de productpagina voor een exact berekend advies.',
          icon: Ruler,
        },
      ];

    default:
      return [
        {
          title: 'Hoogwaardig Sanitair',
          subtitle: 'Tot 10 Jaar Garantie',
          desc: 'Gefabriceerd volgens de strengste Europese kwaliteits- en veiligheidseisen voor jarenlang zorgeloos sanitaircomfort.',
          icon: ShieldCheck,
        },
      ];
  }
});
</script>

<template>
  <div class="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden text-left">
    <!-- Accordion Trigger Header -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="w-full p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors cursor-pointer"
    >
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-50 text-maxaro-accent border border-amber-200/50 flex items-center justify-center shrink-0">
          <HelpCircle class="w-5 h-5" />
        </div>
        <div class="text-left">
          <h3 class="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
            Keuzehulp & Materiaaladvies
          </h3>
          <p class="text-xs text-neutral-500 font-medium">
            Waarop letten bij het selecteren van de juiste uitvoering?
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-neutral-500 hidden sm:inline">
          {{ isOpen ? 'Inklappen' : 'Bekijk advies' }}
        </span>
        <ChevronDown
          class="w-5 h-5 text-neutral-400 transition-transform duration-200"
          :class="isOpen ? 'rotate-180' : ''"
        />
      </div>
    </button>

    <!-- Accordion Content -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="isOpen" class="p-5 sm:p-6 pt-0 border-t border-neutral-100">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(tip, idx) in adviceList"
            :key="idx"
            class="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-200/70 space-y-2"
          >
            <div class="flex items-center gap-2 text-maxaro-blue">
              <component :is="tip.icon" class="w-4 h-4 shrink-0" />
              <h4 class="text-xs font-bold text-neutral-900 tracking-tight">{{ tip.title }}</h4>
            </div>
            <p class="text-[11px] font-mono text-maxaro-accent font-semibold">
              {{ tip.subtitle }}
            </p>
            <p class="text-xs text-neutral-600 leading-relaxed">
              {{ tip.desc }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

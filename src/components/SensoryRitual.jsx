import sensoryRitualBg from '../assets/sensory_ritual_bg.png';

export default function SensoryRitual() {
  return (
    <section
      className="relative w-full h-[75vh] sm:h-[90vh] md:h-[100vh] lg:h-[115vh] min-h-[500px] sm:min-h-[650px] overflow-hidden bg-black select-none bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(${sensoryRitualBg})`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
      aria-label="The Sensory Ritual Showcase"
    />
  );
}

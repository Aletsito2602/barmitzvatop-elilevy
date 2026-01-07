import { Box, SimpleGrid, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const kpis = [
  { label: 'Años', value: 17 },
  { label: 'Meses', value: 204 },
  { label: 'Semanas', value: 816 },
  { label: 'Días', value: 5712 },
  { label: 'Horas', value: 137088 },
  { label: 'Minutos', value: 8225280 },
];

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
    let increment = end / (duration / 16);
    let current = start;
    const step = () => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end);
        return;
      }
      setCount(Math.floor(current));
      requestAnimationFrame(step);
    };
    step();
    // eslint-disable-next-line
  }, [target, duration]);
  return count;
}

const KpiCounter = ({ value, label }) => {
  const count = useCountUp(value, 1800);
  const formatted = count.toLocaleString('es-ES');
  return (
    <VStack
      spacing={1}
      minW={{ base: '120px', md: '140px', lg: '160px' }}
      minH={{ base: '80px', md: '100px' }}
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="bold" color="#F59E0B" textAlign="center">
        {formatted}
      </Text>
      <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.700" fontWeight="semibold" textAlign="center">
        {label}
      </Text>
    </VStack>
  );
};

const KpiCounterSection = () => (
  <Box bg={useColorModeValue('#f4f4f4', 'gray.800')} py={12}>
    <Box maxW="1200px" mx="auto" px={4}>
      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={{ base: 6, md: 8, lg: 12 }} justifyItems="center">
        {kpis.map((kpi, idx) => (
          <KpiCounter key={idx} value={kpi.value} label={kpi.label} />
        ))}
      </SimpleGrid>
    </Box>
  </Box>
);

export default KpiCounterSection; 
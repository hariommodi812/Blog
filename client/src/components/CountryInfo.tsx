import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CountryData } from "@shared/schema";

interface CountryInfoProps {
  countryName: string;
}

const CountryInfo: React.FC<CountryInfoProps> = ({ countryName }) => {
  const { data: countryData, isLoading, error } = useQuery<CountryData>({
    queryKey: [`/api/countries/${countryName}`],
    enabled: !!countryName,
  });

  if (isLoading) {
    return (
      <Card className="my-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
        <CardContent className="p-0">
          <div className="flex items-center mb-4">
            <i className="ri-earth-line text-primary mr-2"></i>
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="md:w-1/3 flex items-center justify-center">
              <Skeleton className="h-28 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !countryData) {
    return null;
  }

  const languages = countryData.languages ? 
    Object.values(countryData.languages).join(', ') : 
    'Not available';
  
  const currencies = countryData.currencies ? 
    Object.values(countryData.currencies).map(c => c.name).join(', ') : 
    'Not available';

  return (
    <div className="my-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <i className="ri-earth-line text-primary mr-2"></i>
        <span>About {countryData.name.common}</span>
      </h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
            <div>
              <p className="text-sm text-neutral-700">Official Name</p>
              <p className="font-medium">{countryData.name.official}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700">Capital</p>
              <p className="font-medium">{countryData.capital?.join(', ') || 'Not available'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700">Population</p>
              <p className="font-medium">{countryData.population.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700">Languages</p>
              <p className="font-medium">{languages}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700">Currency</p>
              <p className="font-medium">{currencies}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700">Region</p>
              <p className="font-medium">{countryData.region}</p>
            </div>
          </div>
          
          <p className="text-neutral-700 text-sm">This information is automatically generated using data from the REST Countries API whenever a country is mentioned in the blog post.</p>
        </div>
        
        <div className="md:w-1/3 flex items-center justify-center">
          <img 
            src={countryData.flags.png} 
            alt={countryData.flags.alt || `Flag of ${countryData.name.common}`} 
            className="max-h-28 border rounded shadow-sm" 
          />
        </div>
      </div>
    </div>
  );
};

export default CountryInfo;

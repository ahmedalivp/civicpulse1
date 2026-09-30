"use client";

import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

interface Issue {
  id: string;
  title: string;
  location?: any;
  status: string;
}

export default function IssueMap({ issues }: { issues: Issue[] }) {
  // Rough coordinates for Riverside (mock)
  const defaultLongitude = -117.3755;
  const defaultLatitude = 33.9533;

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative mb-8">
      <Map
        initialViewState={{
          longitude: defaultLongitude,
          latitude: defaultLatitude,
          zoom: 12
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {issues.filter(i => !!i.location).map(issue => {
          // If we had real postgis coordinates, we'd parse them here.
          // Since it's a mock MVP without postgis parsing, we fake marker placements
          // for the sake of demonstration based on their ID string hashing or random.
          const randOffsetLat = (parseInt(issue.id.substring(0,4), 16) / 65535 - 0.5) * 0.05;
          const randOffsetLng = (parseInt(issue.id.substring(4,8), 16) / 65535 - 0.5) * 0.05;
          
          return (
            <Marker 
              key={issue.id} 
              longitude={defaultLongitude + randOffsetLng} 
              latitude={defaultLatitude + randOffsetLat}
            >
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform" title={issue.title} />
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}

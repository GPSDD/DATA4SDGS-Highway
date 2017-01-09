import L from 'leaflet';
import { PruneCluster, PruneClusterForLeaflet } from 'lib/PruneCluster';

/**
 * Creating buble cluster marker for food layers
 * @param  {Array} geoJson
 * @param  {Object} params
 * @return {Object} layer
 */
export default class BubbleClusterLayer {

  constructor(geoJson) {
    const pruneCluster = new PruneClusterForLeaflet();

    // MARKER
    pruneCluster.BuildLeafletIcon = (feature) => {
      const location = feature.geometry.coordinates;
      const marker = new PruneCluster.Marker(location[1], location[0]); // lat, lng
      marker.data.feature = feature;
      return marker;
    };

    pruneCluster.PrepareLeafletMarker = (leafletMarker, { feature }) => {
      // Options
      const options = {
        location: feature.geometry.coordinates,
        className: 'c-marker-bubble',
        size: BubbleClusterLayer.getSize(feature.properties.value),
        data: feature.properties,
        htmlIcon: BubbleClusterLayer.setMarkerHtml(feature.properties.value),
        htmlInfowindow: BubbleClusterLayer.setInfowindowHtml(feature.properties)
      };

      leafletMarker.setIcon(L.divIcon({
        iconSize: [8, 8],
        // iconSize: [options.size, options.size],
        className: options.className,
        html: options.htmlIcon
      }));
      leafletMarker.bindPopup(options.htmlInfowindow);

      // BINDINGS
      // leafletMarker.off('mouseover').on('mouseover', function mouseover() {
      //   this.openPopup();
      // });
      // leafletMarker.off('mouseout').on('mouseout', function mouseleave() {
      //   this.closePopup();
      // });
    };

    // CLUSTER
    pruneCluster.originalIcon = pruneCluster.BuildLeafletClusterIcon;

    pruneCluster.BuildLeafletCluster = (cluster, position) => {
      const m = new L.Marker(position, {
        icon: pruneCluster.BuildLeafletClusterIcon(cluster)
      });

      m.bindPopup(BubbleClusterLayer.setInfowindowClusterHtml(cluster));

      // m.on('click', () => {
      //   // Compute the  cluster bounds (it's slow : O(n))
      //   const markersArea = pruneCluster.Cluster.FindMarkersInArea(cluster.bounds);
      //   const b = pruneCluster.Cluster.ComputeBounds(markersArea);
      //
      //   if (b) {
      //     const bounds = new L.LatLngBounds(
      //       new L.LatLng(b.minLat, b.maxLng),
      //       new L.LatLng(b.maxLat, b.minLng));
      //
      //     pruneCluster._map.fitBounds(bounds, { // eslint-disable-line
      //       paddingTopLeft: [40, 25],
      //       paddingBottomRight: [60, 25]
      //     });
      //   }
      // });

      // m.on('mouseover', function mouseover() {
      //   this.openPopup();
      // });
      //
      // m.on('mouseout', function mouseout() {
      //   this.closePopup();
      // });

      return m;
    };

    pruneCluster.BuildLeafletClusterIcon = (cluster) => {
      const icon = pruneCluster.originalIcon(cluster);
      icon.options.iconSize = new L.Point(30, 30, null);
      icon.options.className = 'c-marker-cluster-bubble';
      icon.text = cluster.population;

      return icon;
    };

    geoJson.forEach((feature) => {
      pruneCluster.RegisterMarker(pruneCluster.BuildLeafletIcon(feature));
    });

    return pruneCluster;
  }

  static setMarkerHtml(/* value */) {
    return ('<div class="marker-bubble-inner"></div>');
  }

  static setInfowindowHtml(properties) {
    return (`
      <div class="c-infowindow -no-iteraction">
      <h3>${properties.country}</h3>
      </div>`
    );
  }

  static setInfowindowClusterHtml(properties) {
    return (`
      <div class="c-infowindow -no-iteraction">
      <h3>${properties.population} countries</h3>
      </div>`
    );
  }

  static getSize(v) {
    const size = (v < 1) ? 1 : v;
    const multiplicator = 2.5;
    const constant = 50;
    const border = 10;

    return border + constant + (multiplicator * Math.log2(size));
  }

}
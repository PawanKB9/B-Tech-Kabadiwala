  // useEffect(() => {
  //   if (!placeData || !eLoc || !coordinates) return;
  //   if (lastProcessedEloc.current === eLoc) return;

  //   lastProcessedEloc.current = eLoc;

  //   const address = `${placeData.placeName || ""} ${placeData.placeAddress || ""}`.trim();
  //   const pincodeMatch = address.match(/\b\d{6}\b/);

  //   const geo = {
  //     address,
  //     eLoc,
  //     pincode: pincodeMatch ? parseInt(pincodeMatch[0], 10) : null,
  //     latitude: Array.isArray(coordinates) ? coordinates[1] : null, // [lng, lat]
  //     longitude: Array.isArray(coordinates) ? coordinates[0] : null,
  //     coordinates, // [lng, lat]
  //   };

  //   console.info("[SearchAddress] final geo ready, calling onSelect:", geo);
  //   if (typeof onSelect === "function") {
  //     try {
  //       onSelect(geo);
  //     } catch (err) {
  //       console.error("[SearchAddress] onSelect threw error:", err);
  //     }
  //   } else {
  //     console.warn("[SearchAddress] onSelect is not a function");
  //   }

  //   setPlaceData(null);
  //   setEloc("");
  //   setCoordinates(null);
  // }, [placeData, eLoc, coordinates, onSelect]);
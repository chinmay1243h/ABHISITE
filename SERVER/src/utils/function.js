const getRawData = (data) => {
  const raw = JSON.parse(JSON.stringify(data));
  
  // Convert MongoDB _id to id if needed
  if (raw && raw._id && !raw.id) {
    raw.id = raw._id.toString ? raw._id.toString() : raw._id;
  }
  
  // Handle arrays
  if (Array.isArray(raw)) {
    return raw.map(item => {
      if (item && item._id && !item.id) {
        item.id = item._id.toString ? item._id.toString() : item._id;
      }
      return item;
    });
  }
  
  return raw;
};

module.exports = {
  getRawData,
};

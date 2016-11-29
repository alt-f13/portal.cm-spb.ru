function(doc) {
  if (doc.type == "link") {
    emit(doc.date, {
      id: doc._id,
      date: doc.date,
      title: doc.title,
      href: doc.href
    });
  }
};

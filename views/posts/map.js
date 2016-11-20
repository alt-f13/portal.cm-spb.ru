function(doc) {
  if (doc.type == "post") {
    emit(doc._id, {
      date: doc.date,
      title: doc.title,
      tags: doc.tags,
      description: doc.description,
      logo: doc.logo,
      published: doc.published
    });
  }
};

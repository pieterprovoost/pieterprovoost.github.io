<section class="page-section">
  <h2 class="page-section__label">Software</h2>
  <div class="page-section__content page-section__content--indent-body">
    <div class="projects">
    {% for project in site.projects %}
    <div class="project">
        <div class="text">
            <h4><a href="{{ project.website }}" target="_blank">{{ project.title }}</a></h4>
            <p>{{ project.description }}</p>
        </div>
        <div class="image">
            <img alt="{{ project.title }}" src="{{ project.image }}" />
        </div>
    </div>
    {% endfor %}
    </div>
  </div>
</section>

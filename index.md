---
layout: default
---

Hi, I'm Pieter Provoost. I'm a marine scientist and data engineer, working as a biodiversity informatician at UNESCO's [Intergovernmental Oceanographic Commission](https://www.ioc.unesco.org/en).

## Projects

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
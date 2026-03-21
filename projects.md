## Software

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
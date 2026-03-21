# frozen_string_literal: true

module Jekyll
  module BibliographyFilters
    def fix_citation(input)
      result = input.gsub(%r{(https?://doi\.org/[^\s"<]+)}i) do |doi_url|
        %(<a target="_blank" href="#{doi_url}">#{doi_url}</a>)
      end

      result.gsub(/(Provoost, P\.)/) do |match|
        %(<strong>#{match}</strong>)
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::BibliographyFilters)

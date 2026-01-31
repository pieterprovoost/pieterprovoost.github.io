module Jekyll
  module DOIConverter
    def fix_citation(input)
      result = input.gsub(/(https?:\/\/doi\.org\/[^\s"<]+)/i) do |doi_url|
        %(<a href="#{doi_url}">#{doi_url}</a>)
      end
      
      result.gsub(/(Provoost, P\.)/) do |match|
        %(<strong>#{match}</strong>)
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::DOIConverter)

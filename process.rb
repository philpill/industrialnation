require 'nokogiri'
require 'json'

doc = Nokogiri::HTML(open("bookmarks.html"))
template = Nokogiri::HTML(open("template.html"))


links = doc.css("a")

templateItems = []
tagLabels = []
tags = Hash.new

links.each do |link|
    linkTags = link['tags'].split(',')
    tagLabels.push(*linkTags)
end

tagLabels = tagLabels.uniq

# puts tagLabels

tagLabels.each do |tag|
    tags[tag] = []
end

links.each do |link|

    linkTags = link['tags'].split(',')

    templateItem = Nokogiri::HTML.fragment(template.css('.item').first.to_html)

    templateItem.css('a').first['href'] = link['href']
    templateItem.css('a').first.content = link.text

    linkTags.each do |linkTag|
        tags[linkTag].push(templateItem)
    end

    templateItems.push(templateItem)

end

tagLabels.each do |tag|

    if tag != 'unread' && tag != 'toread'

        listSection = Nokogiri::HTML.fragment('<section class="listSection"></section>')
        listHeader = Nokogiri::HTML.fragment('<h2 class="listSection">' + tag + '</h2>')
        list = Nokogiri::HTML.fragment('<ul class="list"></ul>')

        tags[tag].each do |item|
            list.at('ul').add_child(item.to_html)
        end

        listSection.at('section').add_child(listHeader.to_html)
        listSection.at('section').add_child(list.to_html)

        template.at('#Bookmarks').add_child(listSection.to_html)
    end
end


# tags.each do |tag|
#     puts tag
#     tags[tag]&.each do |val|
#         puts val
#     end
# end

# puts template

File.open("index.html", "a+") do |f|
    f.truncate(0)
    f.write(template)
end
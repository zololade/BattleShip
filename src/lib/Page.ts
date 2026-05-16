// Types for the page data structure
export type ElementObject = {
  tag: string;
  content?: string | PageData[];
  [key: string]: unknown; // allows arbitrary HTML attributes
};

export type PageData = ElementObject | PageData[] | string | number;

export default class Page {
  private static DOM_RECORD: Map<HTMLElement, PageData> = new Map();

  static isObject(value: unknown): value is ElementObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  static build(
    incomingObject: PageData,
  ): HTMLElement | DocumentFragment | SVGSVGElement | SVGPathElement | Text {
    let tag: string;
    let content: string | PageData[] | undefined;
    let el: HTMLElement | DocumentFragment | SVGSVGElement | SVGPathElement;
    let att: Record<string, unknown>;

    if (Page.isObject(incomingObject)) {
      ({ tag, content, ...att } = incomingObject);
      el =
        tag === "svg" || tag === "path"
          ? document.createElementNS("http://www.w3.org/2000/svg", tag)
          : document.createElement(tag);

      Object.entries(att).forEach(([key, value]) => {
        if (key === "xmlns") return;
        const lookupKey = key === "class" ? "className" : key;
        if (lookupKey in el && !(el instanceof SVGElement)) {
          (el as unknown as Record<string, unknown>)[lookupKey] = value;
        } else {
          (el as HTMLElement).setAttribute(key, String(value));
        }
      });
    } else if (Array.isArray(incomingObject)) {
      content = incomingObject;
      el = document.createDocumentFragment();
    } else {
      return document.createTextNode(String(incomingObject));
    }

    if (typeof content === "string") {
      (el as HTMLElement).textContent = content;
    } else if (Array.isArray(content)) {
      content.forEach((data) => {
        el.appendChild(Page.build(data));
      });
    }

    return el;
  }

  static snapshotRender(currentHost: HTMLElement, elem: PageData): void {
    const previousRecord = Page.DOM_RECORD.get(currentHost);
    if (
      previousRecord &&
      JSON.stringify(previousRecord) === JSON.stringify(elem)
    )
      return;

    currentHost.innerHTML = "";
    const fragment = document.createDocumentFragment();
    fragment.appendChild(Page.build(elem));
    currentHost.appendChild(fragment);

    Page.DOM_RECORD.set(currentHost, elem);
  }

  static pureRender(
    host: HTMLElement,
    elem:
      | HTMLElement
      | DocumentFragment
      | Text
      | SVGSVGElement
      | SVGPathElement,
  ) {
    host.innerHTML = "";
    const fragment = document.createDocumentFragment();
    fragment.appendChild(elem);
    host.appendChild(fragment);
  }
}
